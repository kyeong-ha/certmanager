import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import InputBlock from '@/components/ui/InputBlock';
import UserFormBlock from '@/features/user/components/UserFormBlock';
import CenterSelect from '@/features/center/components/CenterSelect';
import FileInputBlock from '@/components/FileInputBlock';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { EducationCenterSessionSummary } from '@/features/center/types/EducationCenterSession.type';
import { UserWriteForm } from '@/features/user/types/User.type';
import { createCertificate } from '@/features/certificate/services/cert.api';
import { CertificateSummary, CertificateDetail, CertificateWriteForm } from '../types/Certificate.type';
import CenterCreateModal from '@/features/center/modals/CenterCreate.modal';
import BulkExcelImport from '@/components/BulkExcelImport';
import { fetchUserByPhone, createUser } from '@/features/user/services/user.api';
import { fetchAllEducationSession, fetchAllCenter, createEducationCenter, createEducationSession } from '@/features/center/services/center.api';
import { normalizeDate } from '@/utils/normalizeDate';

interface CertificateCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CertificateCreateModal({ isOpen, onClose, onSuccess }: CertificateCreateModalProps) {
  const sessionList = useSelector((state: RootState) => state.educationCenter.sessions);

  // Bulk 모드 상태
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkData, setBulkData]     = useState<any[]>([]);

  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [writeData, setWriteData] = useState({
    issue_number: '',
    issue_date: '',
    course_name: '',
    delivery_address: '',
    tracking_number: '',
    photo: null as File | null,
    user: {
      user_id: '',
      user_name: '',
      birth_date: '',
      phone_number: '',
      postal_code: '',
      address: '',
    } as UserWriteForm,
    education_session_uuid: ''
  });

  const [selectedCenterName, setSelectedCenterName] = useState('');
  const [selectedSession, setSelectedSession] = useState<EducationCenterSessionSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setWriteData((prev) => ({
      ...prev,
      education_session_uuid: selectedSession?.uuid || '',
    }));
  }, [selectedSession]);

  
  // 일괄 등록 핸들러
  const handleBulkCreate = async () => {
    try {
      let successCount = 0;
      const failedRows: string[] = [];
      const certPayloads: CertificateWriteForm[] = [];

      // 0) 최신 센터/세션 리스트 미리 로드
      let sessions = await fetchAllEducationSession();
      let centers  = await fetchAllCenter();

      for (let i = 0; i < bulkData.length; i++) {
        const row = bulkData[i];

        try {
          // 1) "교육원명" 파싱
          const full = row['교육원명 (예시: 한국교육원_1기)'];
          const [centerName, sessionLabel] = full.split('_');
          const sessionNum = parseInt(sessionLabel.replace('기', ''), 10);

          // 2) 교육원 조회
          let center = centers.find(c => c.center_name === centerName);
          if (!center) {
            // 2-1) 교육원이 없으면 신규 생성
            center = await createEducationCenter({
              uuid: '',
              center_name: centerName,
              center_tel: '',
              ceo_name: '', ceo_mobile: '',
              manager_name: '', manager_mobile: '',
              center_address: '', delivery_address: '',
              center_session: String(sessionNum) // 생성 시 첫 기수로 설정
            });
            centers = await fetchAllCenter();
            sessions = await fetchAllEducationSession();
          }

          // 3) 교육기수 조회
          let session = sessions.find(s =>
            s.education_center.center_name === centerName &&
            s.center_session === sessionNum
          );
          if (!session) {
            // 3-1) 교육기수가 없으면 신규 생성
            session = await createEducationSession({
              uuid: '',
              education_center_uuid: center.uuid,
              center_session: sessionNum,
              unit_price: 0,
              delivery_address: '',
            });
            sessions = await fetchAllEducationSession();
          }

            // 4) 사용자 조회
            const phone = row['전화번호'];
            if (!phone) throw new Error('전화번호가 누락되었습니다.');
            let user = await fetchUserByPhone(phone);
            if (!user) {
              // 4-1) 사용자 없으면 신규 생성
              const userPayload: UserWriteForm = {
                user_id: row['회원ID(선택)'] || '',
                user_name: row['이름'] || '',
                birth_date: row['생년월일'] || '',
                phone_number: phone, // PK
                postal_code: '', 
                address: '',
                education_session: [session.uuid],
              };
              user = await createUser(userPayload as any);
              if (!user) throw new Error(`사용자 생성 실패: ${phone}`);
            }
            
            // 5) 신규 자격증 생성
            certPayloads.push({
              issue_number: row['발급번호'],
              issue_date: row['발급일자'],
              course_name: row['과정명'],
              delivery_address: row['배송 주소(선택)']   || '',
              tracking_number: row['운송장 번호(선택)'] || '',
              photo: row['증명사진'] ? (row['증명사진'] as File) : null,
              user: user.uuid,
              education_session: session.uuid,
            });
            successCount++;

          } catch (innerErr) {
            failedRows.push(row['발급번호'] || row['성명'] || `Row ${i + 1}`);
          }
      }
      await createCertificate(certPayloads as any);

      alert(`✅ 총 ${successCount}건 등록 완료\n❌ 실패한 건수: ${failedRows.length}\n${failedRows.join(', ')}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(`일괄 등록 중 오류: ${err.message}`);
    }
  };

  const handleChangeCert = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWriteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWriteData((prev) => ({ ...prev, user: { ...prev.user, [name]: value } }));
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

  if (name === 'photo') {
      setWriteData((prev) => ({ ...prev, photo: files[0] }));
    }
  };

  const handleSave = async () => {
    // 저장 전 유효성 검사
    if (!selectedSession) {
      alert('교육기관 기수를 선택해주세요.');
      return;
    }
    if (!writeData.issue_number || !writeData.issue_date || !writeData.course_name || !writeData.user.user_name) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataObj = new FormData();

      // 1. 기본 자격증 정보
      formDataObj.append('issue_number', writeData.issue_number);
      formDataObj.append('issue_date', writeData.issue_date);
      formDataObj.append('course_name', writeData.course_name);
      formDataObj.append('tracking_number', writeData.tracking_number ?? '');
      formDataObj.append('delivery_address', writeData.delivery_address ?? '');
      if (writeData.photo) {
        formDataObj.append('photo', writeData.photo);
      }
      
      // 2. 사용자 정보
      formDataObj.append('user_id', writeData.user.user_id ?? '');
      formDataObj.append('user_name', writeData.user.user_name);
      formDataObj.append('birth_date', normalizeDate(writeData.user.birth_date));
      formDataObj.append('phone_number', writeData.user.phone_number);
      formDataObj.append('postal_code', writeData.user.postal_code ?? '');
      formDataObj.append('address', writeData.user.address ?? '');


      // 3. 교육기관 세션 정보
      formDataObj.append('education_session', selectedSession.uuid);

      // 4. 인증서 생성 요청
      const res = await createCertificate(formDataObj);
      onSuccess();
      console.log('등록 성공', res);
      onClose();
    } catch (err) {
      alert('등록 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-md z-40" />
      <DialogContent className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-xl overflow-hidden">
        <DialogHeader className="bg-white p-3 border-b">
          <DialogTitle className="text-xl font-semibold">자격증 등록</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">새로운 자격증 정보를 입력하세요.</DialogDescription>
        </DialogHeader>

        {/* 모드 토글 */}
        <div className="p-4">
          <div className="mb-4 flex space-x-6">
            <label className="flex items-center">
              <input type="radio" checked={!isBulkMode} onChange={() => setIsBulkMode(false)} />
              <span className="ml-2">개별 등록</span>
            </label>
            <label className="flex items-center">
              <input type="radio" checked={isBulkMode} onChange={() => setIsBulkMode(true)} />
              <span className="ml-2">엑셀 일괄 등록</span>
            </label>
          </div>

          {isBulkMode ? (
            <>
              {/* 템플릿 다운로드 */}
              <div className="flex justify-end mb-2">
                <a href="/templates/certificate-template.xlsx" download className="text-sm text-blue-600 hover:underline">
                  ▶ 자격증 템플릿 다운로드
                </a>
              </div>
              {/* 엑셀 업로드 & 그리드 */}
              <BulkExcelImport onDataLoaded={setBulkData} />
              {/* 일괄 등록 버튼 */}
              <div className="flex justify-end mt-4">
                <Button onClick={handleBulkCreate} disabled={isSubmitting}>
                  일괄 등록하기
                </Button>
              </div>
            </>
          ) : (
            /* 기존 개별 등록 UI */
              
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">👤 사용자 정보</h3>
                <UserFormBlock user={writeData.user} onChange={handleChangeUser} editable={true} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">🎖️ 자격증 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputBlock label="발급번호" name="issue_number" value={writeData.issue_number} onChange={handleChangeCert} editable={true} />
                  <InputBlock label="발급일자" name="issue_date" type="date" value={writeData.issue_date} onChange={handleChangeCert} editable={true} />
                  <InputBlock label="자격과정" name="course_name" value={writeData.course_name} onChange={handleChangeCert} editable={true} />
                  <InputBlock label="운송장번호" name="tracking_number" value={writeData.tracking_number} onChange={handleChangeCert} editable={true} />
                  <FileInputBlock label="증명사진 (JPG/PNG)" name="photo" accept="image/*" onChange={handleChangeFile} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">🏫 교육기관 정보</h3>
                <CenterSelect
                  editMode={true}
                  selectedCenterName={selectedCenterName}
                  setSelectedCenterName={setSelectedCenterName}
                  selectedSession={selectedSession}
                  setSelectedSession={setSelectedSession}
                  sessionList={sessionList}
                  onOpenCreateModal={() => {}}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSubmitting}>저장</Button>
              </div>
            </div>
          )}
        </div>

        {/* 교육기관 등록 모달 */}
        <CenterCreateModal
          isOpen={isCenterModalOpen}
          onClose={() => setIsCenterModalOpen(false)}
          onSuccess={(newUuid) => {
            setIsCenterModalOpen(false);
            const session = sessionList.find((s) => s.uuid === newUuid);
            if (!session) return;
            setSelectedCenterName(session.education_center.center_name);
            setSelectedSession(session);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}