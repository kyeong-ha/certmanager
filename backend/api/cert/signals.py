"""
backend/api/cert/signals.py
──────────────────────────
Certificate(발급/삭제) 변동에 따라
EducationCenterSession - 통계 & 상태를 자동 동기화하는 시그널 모듈
"""

# 표준 라이브러리
from __future__ import annotations
import logging
from typing import Any

# Django
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

# Local Apps
from api.cert.models import Certificate
from api.center.models.EducationCenterSession import (
    EducationCenterSession,
    IssueStatus,
)

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────────────────
# Certificate 발급 / 삭제 → Session 통계 & 상태 갱신
# ──────────────────────────────────────────────────────────────────────
@receiver(post_save, sender=Certificate)
@receiver(post_delete, sender=Certificate)
def update_session_statistics(sender: type[Certificate], instance: Certificate, **kwargs: Any) -> None:  # ➕ 추가됨
    """
    Certificate 가 생성·수정·삭제될 때마다 EducationCenterSession 의
    issue_count, issue_date, issue_status 를 재계산합니다.
    """
    session: EducationCenterSession = instance.education_session
    cert_qs = session.certificates.all()

    # 발급 개수
    issue_count = cert_qs.count()
    session.issue_count = issue_count

    # 최초 발급일 및 상태
    if issue_count:
        earliest_cert = cert_qs.order_by("issue_date").first()
        session.issue_date = earliest_cert.issue_date
        session.issue_status = IssueStatus.ISSUED
    else:
        session.issue_date = None
        session.issue_status = IssueStatus.DRAFT

    session.save(
        update_fields=["issue_count", "issue_date", "issue_status"]
    )
    logger.debug(
        "Session %s statistics updated → count=%s, date=%s, status=%s",
        session.pk, session.issue_count, session.issue_date, session.issue_status,
    )