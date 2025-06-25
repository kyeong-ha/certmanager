import re, logging
import sys
from openpyxl import load_workbook
from openpyxl.utils.datetime import from_excel
from django.core.management.base import BaseCommand
from datetime import datetime

from api.user.models.User import User
import os       
import json
import hashlib
from django.conf import settings
from api.cert.models.Certificate import Certificate
from api.center.models.EducationCenter import EducationCenter
from api.center.models.EducationCenterSession import EducationCenterSession
from utils.photo_synchronizer import update_single_certificate  # 사진 동기화 함수

# 로거 생성
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = '여러 시트의 자격증_발급대장.xlsx로부터 자격증, 사용자, 교육원 데이터를 임포트합니다.'
    
    # 실제 마운트된 테스트 파일 경로
    file_path = '/web/backend/media/자격증_발급대장_test.xlsx'
    # issue_number 형식: yyyy-X-numbering (X가 issue_type)
    ISSUE_NO_REGEX = re.compile(r'^(\d{4})-([A-Z]+)-(\d+)$')

    def handle(self, *args, **options):
        state_file = os.path.join(settings.MEDIA_ROOT, 'import_hashes.json')
        if os.path.exists(state_file):
            with open(state_file, 'r', encoding='utf-8') as f:
                hash_state = json.load(f)
        else:
            hash_state = {}
        new_hash_state = {}
        
        try:
            wb = load_workbook(self.file_path, data_only=True)
        except Exception as e:
            logger.exception("워크북 로드 실패")  
            self.stderr.write(f"[✖️ 전체] 워크북 로드 실패: {e}")
            return

        for sheet_name in wb.sheetnames:
            try:
                ws = wb[sheet_name]
                self.stdout.write(f"[시트] '{sheet_name}' 처리 시작")

                # 1. 헤더(1행) 읽어서 동적 인덱스 매핑
                headers = [cell.value for cell in ws[1]]
                idx = {
                    'issue_number': headers.index('발급번호'),
                    'issue_date':   headers.index('발급일자'),
                    'user_name':    headers.index('성명'),
                    'birth_date':   headers.index('생년월일'),
                    'course_name':  headers.index('자격과정'),
                    'phone_number': headers.index('핸드폰'),
                    'center_str':   headers.index('교육원명'),
                    'user_id':      headers.index('아이디'),
                    'postal_code':  headers.index('우편번호'),
                    'address':      headers.index('주소'),
                    'memo':         headers.index('비고'),
                }

                # 2. 2행부터 각 행 처리
                for row_idx, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
                    try: # 행 단위 예외 처리
                        
                        # 종료 조건: 발급일자·성명 모두 비어 있으면 시트 종료
                        if not row[idx['issue_date']] and not row[idx['user_name']]:
                            self.stdout.write(f"[✅ {sheet_name}:{row_idx}] 데이터 없음, 시트 종료")
                            break
                        
                        # 2-1. 발급번호 파싱 (issue_type 추출)
                        issue_number = row[idx['issue_number']]
                        match = self.ISSUE_NO_REGEX.match(str(issue_number))
                        if not match:
                            self.stderr.write(f"[⚠️ {sheet_name}:{row_idx}] 발급번호 형식 불일치: {issue_number}")
                            continue
                        _, issue_type, _ = match.groups()
                        

                        # 2-2. issue_date 파싱
                        raw_issue_date = row[idx['issue_date']]
                        if isinstance(raw_issue_date, datetime):
                            issue_date = raw_issue_date.date()
                        else:
                            for fmt in ("%Y-%m-%d", "%Y.%m.%d", "%Y/%m/%d"):
                                try:
                                    issue_date = datetime.strptime(str(raw_issue_date), fmt).date()
                                    break
                                except:
                                    continue
                            else:
                                self.stderr.write(f"[⚠️ {sheet_name}:{row_idx}] 날짜 파싱 실패: {raw_issue_date}")
                                continue

                        # 2-3. birth_date 파싱
                        raw_birth = row[idx['birth_date']]
                        birth_date = None

                        try:
                            # Excel(serial) 로 된 날짜 처리
                            if isinstance(raw_birth, (int, float)):
                                birth_date = from_excel(raw_birth).date()

                            # datetime 객체일 경우
                            elif isinstance(raw_birth, datetime):
                                birth_date = raw_birth.date()

                            # 문자열로 전달될 때 다양한 포맷 시도
                            else:
                                for fmt in ("%Y-%m-%d", "%Y.%m.%d", "%Y/%m/%d"):
                                    try:
                                        birth_date = datetime.strptime(str(raw_birth), fmt).date()
                                        break
                                    except ValueError:
                                        continue

                            # 파싱 실패 시 예외 발생
                            if not birth_date:
                                raise ValueError(f"Unsupported birth_date format: {raw_birth}")

                        except Exception:
                            # 실패 메시지에 원본값도 같이 출력
                            self.stderr.write(f"[⚠️ {sheet_name}:{row_idx}] 생년월일 파싱 실패: {raw_birth}")
                            continue

                        # 2-4. 나머지 필드
                        course_name  = row[idx['course_name']]
                        user_name    = row[idx['user_name']]
                        phone_number = row[idx['phone_number']]
                        center_str   = row[idx['center_str']]
                        user_id      = row[idx['user_id']]
                        postal_code  = row[idx['postal_code']]
                        address      = row[idx['address']]
                        memo         = row[idx['memo']]

                        # 3. 교육원 및 기수 파싱
                        try:
                            center_name, session_label = center_str.split("_")
                            center_session_num = int(session_label.replace("기", ""))
                        except Exception:
                            self.stderr.write(f"[⚠️ {sheet_name}:{row_idx}] 교육기관명_기수 파싱 실패, 스킵: {center_str}")
                            continue

                         # 4. 교육원 조회/생성 (1:N 관계 유지)
                        centers = EducationCenter.objects.filter(center_name=center_name)
                        if centers.exists():
                            center = centers.first()
                        else:
                            center = EducationCenter.objects.create(center_name=center_name)

                        # 5. 교육기수 조회/생성 (교육원:교육기수 = 1:N 관계 유지)
                        sessions = EducationCenterSession.objects.filter(
                            education_center=center,
                            center_session=center_session_num
                        )
                        if sessions.exists():
                            session = sessions.first()
                        else:
                            session = EducationCenterSession.objects.create(
                                education_center=center,
                                center_session=center_session_num
                            )

                        # 5. 사용자
                        users = User.objects.filter(phone_number=phone_number)
                        if users.exists():
                            # 기존 사용자 재사용
                            user = users.first()
                            # 정보 업데이트 및 연결
                            user.user_name         = user_name
                            user.birth_date        = birth_date
                            user.postal_code       = postal_code
                            user.address           = address
                            user.save()
                        else:
                            # 신규 사용자 생성 및 연결
                            user = User.objects.create(
                                user_id            = user_id,
                                user_name          = user_name,
                                birth_date         = birth_date,
                                phone_number       = phone_number,
                                postal_code        = postal_code,
                                address            = address,
                            )
                        user.education_session.set([session]) # 사용자와 교육기수 연결
                        
                        # 추가: 행 데이터 해시 계산 및 변경 여부 확인
                        row_data = {
                            'issue_date':      issue_date.isoformat(),
                            'course_name':     course_name,
                            'memo':            memo,
                            'center_name':     center_name,
                            'session_num':     center_session_num,
                            'user_phone':      phone_number,
                        }
                        row_hash = hashlib.md5(
                            json.dumps(row_data, sort_keys=True, ensure_ascii=False).encode('utf-8')
                        ).hexdigest()
                        prev_hash = hash_state.get(issue_number)

                        exists_in_db = Certificate.objects.filter(issue_number=issue_number).exists()
                        if prev_hash == row_hash and exists_in_db:
                            # 변경이 없는 경우: 동기화 미리 호출
                            cert = Certificate.objects.get(issue_number=issue_number)
                            
                            # DEBUG
                            print(f"[ImportCert] {issue_number}: skipped DB update, but syncing photo")
                            sys.stdout.flush()
                            
                            # 사진 동기화 함수 호출
                            update_single_certificate(cert, prefix=f"{issue_type}_{center_name}_{center_session_num}기_{issue_date.strftime('%y%m%d')}")
                            new_hash_state[issue_number] = row_hash
                            self.stdout.write(f"[{sheet_name}:{row_idx}] {issue_number} – 변경 없음")
                            continue
                        new_hash_state[issue_number] = row_hash
                        
                        # 6. 자격증 생성/업데이트
                        existing_cert = Certificate.objects.filter(user=user, course_name=course_name)
                        if existing_cert.exists():
                            # 동일 사용자·자격과정이 이미 있으면 오류
                            self.stderr.write(
                                f"[⚠️ {sheet_name}:{row_idx}] 사용자({phone_number})에 이미 등록된 자격과정: {course_name}"
                            )
                            continue
                        
                        try:
                            cert_qs = Certificate.objects.filter(issue_number=issue_number)
                            if cert_qs.exists():
                                cert = cert_qs.first()
                                # ▶ 변경된 필드만 업데이트
                                cert.issue_date       = issue_date
                                cert.course_name      = course_name
                                cert.user             = user
                                cert.education_center = center
                                cert.education_session= session
                                cert.memo             = memo
                                cert.is_online        = issue_type in ['N','HN'], # N, HN은 온라인 교육
                                cert.issue_type = issue_type
                                cert.save()
                                action = "업데이트"
                            else:
                                cert = Certificate.objects.create(
                                    issue_number       = issue_number,
                                    course_name        = course_name,
                                    issue_date         = issue_date,
                                    user               = user,
                                    education_center   = center,
                                    education_session  = session,
                                    memo               = memo,
                                    issue_type = issue_type,
                                    is_online         = issue_type in ['N','HN'],  # N, HN은 온라인 교육
                                )
                                action = "생성"
                        except Exception as e:
                            # issue_number 중복 등 예외 발생 시
                            logger.exception(f"Certificate 생성 실패 [{sheet_name}:{row_idx}]")
                            self.stderr.write(f"[⚠️ {sheet_name}:{row_idx}] Certificate 생성 오류: {e}")
                            continue

                        # 7. 운송장 리스트 업데이트
                        if cert.tracking_number and cert.tracking_number not in session.tracking_numbers:
                            session.tracking_numbers.append(cert.tracking_number)
                            session.save()

                        # 8. Photo 자동 연결
                        prefix = f"{issue_type}_{center.center_name}_{session.center_session}기_{issue_date.strftime('%y%m%d')}"
                        
                        # DEBUG: 호출 전 상태 출력
                        print(f"[ImportCert] {issue_number}: calling update_single_certificate with prefix={prefix}")
                        sys.stdout.flush()
                        
                        synced = update_single_certificate(cert, prefix=prefix)
                        
                        # DEBUG: 동기화 결과 출력
                        print(f"[ImportCert] {issue_number}: update_single_certificate returned {synced}")
                        sys.stdout.flush()

                        # 9. 처리 결과 로깅
                        self.stdout.write(f"[{sheet_name}:{row_idx}] {user_name} – {issue_number} ({action})")
                        
                    except Exception as e:
                        logger.exception(f"행 처리 중 예외 [{sheet_name}:{row_idx}]")
                        self.stderr.write(f"[⚠️ {sheet_name}:{row_idx}] 오류: {e}")

                self.stdout.write(f"[시트] '{sheet_name}' 처리 완료\n")
            except Exception as e:
                logger.exception(f"시트 처리 중 예외 [{sheet_name}]")
                self.stderr.write(f"[✖️ 시트] '{sheet_name}' 실패: {e}")

        with open(state_file, 'w', encoding='utf-8') as f:
            json.dump(new_hash_state, f, ensure_ascii=False, indent=2)
            self.stdout.write(f"[✅ 전체] 자격증 임포트 완료")