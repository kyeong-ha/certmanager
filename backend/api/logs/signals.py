"""
backend/api/logs/signals.py
──────────────────────────
ReissueLog(재발급 로그) 변동에 따라
EducationCenterSession - 통계 & 상태를 자동 동기화하는 시그널 모듈
"""

from __future__ import annotations
import logging
from typing import Any

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from api.center.models.EducationCenterSession import EducationCenterSession
from api.logs.models import ReissueLog

logger = logging.getLogger(__name__)


@receiver(post_save, sender=ReissueLog)
def touch_session_for_new_log(
    sender: type[ReissueLog],
    instance: ReissueLog,
    **kwargs: Any
) -> None:
    """
    새 ReissueLog 가 생성되면 EducationCenterSession.updated_at 갱신하여
    '최근 변경' 표시가 가능하도록 합니다.
    """
    session: EducationCenterSession = instance.certificate_uuid.education_session
    session.updated_at = timezone.now()  
    session.save(update_fields=["updated_at"])
    logger.debug(
        "Session %s updated_at touched due to new log",
        session.pk
    )
