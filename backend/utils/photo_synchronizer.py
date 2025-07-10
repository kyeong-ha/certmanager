import os
from pathlib import Path
from django.conf import settings
from api.cert.models import Certificate
import logging

logger = logging.getLogger(__name__)

def update_single_certificate(cert: Certificate, prefix: str | None = None) -> bool:
    """
    - 단일 Certificate 인스턴스의 photo 필드를 갱신합니다.
    - 매칭되면 cert.photo.name 설정 후 True 반환
    - 못 찾으면 False 반환 (photo는 None 유지)
    """
    media_root = Path(settings.MEDIA_ROOT)
    cert.photo = None

    # print(f"[PhotoSync] {cert.issue_number} 사진 동기화 호출 완료")  # DEBUG
    # print(f"[PhotoSync] Prefix: {prefix}")  # DEBUG
    
    try:
        # ── 온라인 사진 처리 ──
        if cert.is_online:
            online_dir = media_root / "images"
            user_id = cert.user.user_id
            for ext in (".jpg", ".jpeg", ".png"):
                candidate = online_dir / f"{user_id}{ext}"
                # logger.debug(f"[PhotoSync] 온라인 경로 체크: {candidate}")
                
                if candidate.exists():
                    cert.photo.name = str(candidate.relative_to(media_root))
                    cert.save(update_fields=["photo"])
                    # logger.info(f"[PhotoSync] 온라인 매핑 성공: {cert.issue_number} → {candidate}")
                    return True
            # logger.warning(f"[PhotoSync] 온라인 사진 미발견: {cert.issue_number} in {online_dir}")
            return False

        # ── 오프라인 사진 처리 ──
        date = cert.issue_date
        # prefix 없으면 기존 호출 방식에 맞춰 생성
        if prefix is None:
            center = cert.education_session.education_center
            session_no = cert.education_session.center_session
            prefix = f"{cert.issue_type}_{center.center_name}_{session_no}기__{date.strftime('%y%m%d')}"
            
        session_dir = f"{prefix}"
        # logger.debug(f"[PhotoSync] 오프라인 경로 체크: {session_dir}")
        
        subdir = (
            media_root
            / f"{date.year}년"
            / f"{date.month:02d}월{date.day:02d}일"
            / session_dir
            / "images"
        )
        # logger.debug(f"[PhotoSync] 오프라인 서브디렉터리: {subdir}")
        if not subdir.exists():
            # logger.warning(f"[PhotoSync] 오프라인 디렉터리 미발견: {subdir}")
            return False
        # print(f"[PhotoSync] 오프라인 디렉터리 확인: {subdir}")
        
        
        fname = f"{cert.user.user_name}_{cert.user.birth_date.strftime('%y%m%d')}"
        for ext in (".jpg", ".jpeg", ".png"):
            candidate = subdir / f"{fname}{ext}"
            # logger.debug(f"[PhotoSync] 경로 체크: {candidate}")
            if candidate.exists():
                cert.photo.name = str(candidate.relative_to(media_root))
                cert.save(update_fields=["photo"])
                # logger.info(f"[PhotoSync] 오프라인 매핑 성공: {cert.issue_number} → {candidate}")
                return True

        # logger.warning(f"[PhotoSync] 오프라인 사진 미발견: {cert.issue_number} in {subdir}")
        return False

    except Exception as e:
        logger.exception(f"[PhotoSync] 예외 발생: {cert.issue_number}: {e}")
        return False

def synchronize_all_certificates() -> int:
    """
    - 전체 Certificate에 대해 update_single_certificate를 호출
    - 업데이트된 건수 반환
    """
    updated_count = 0
    for cert in Certificate.objects.all():
        if update_single_certificate(cert):
            updated_count += 1
    return updated_count
