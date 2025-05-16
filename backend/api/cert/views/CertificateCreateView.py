from __future__ import annotations

"""
───────────────────────────────────
동작 순서
───────────────────────────────────
1. UUID 리스트 유효성 검사
2. Certificate 조회
3. 반복 처리: 증명서 발급 → 파일·DB 저장
    3-1) 기존 copy_file 삭제: _safe_remove_file(...)
    3-2) PDF 생성: generate_certificate_pdf(...)
    3-3) FileField 에 저장: save_certificate_pdf(...)
4. 결과 요약 반환

실패한 증명서가 있어도 나머지 증명서는 계속 발급되며, 최종 응답에 `failed` 목록으로 실패 내역을 표시함.
"""

from pathlib import Path
from typing import List, Dict

from django.conf import settings
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.cert.models.Certificate import Certificate
from api.cert.services.generator import generate_certificate_pdf, save_certificate_pdf

# ──────────────────────────────────────────────────────────
# 헬퍼 함수
# ──────────────────────────────────────────────────────────

def _safe_remove_file(file_path: Path) -> None:
    """파일이 존재하면 삭제한다."""
    try:
        if file_path.is_file():
            file_path.unlink()
    except Exception as exc:  # 실제 오류 상황만 로그로 남기고 진행
        print(f"⚠ 파일 삭제 실패: {file_path} → {exc}")


# ──────────────────────────────────────────────────────────
# API View
# ──────────────────────────────────────────────────────────

@api_view(["POST"])
def create(request):  # noqa: ANN001 – DRF View 함수 시그니처 규칙
    """선택된 Certificate 들에 대해 PDF 를 생성하고 copy_file 에 저장한다."""

    uuids: List[str] = request.data.get("uuids", [])
    if not isinstance(uuids, list) or not uuids:
        return Response(
            {"error": "uuid 리스트가 필요합니다."}, status=status.HTTP_400_BAD_REQUEST
        )

    certificates = (
        Certificate.objects.select_related("user")
        .filter(uuid__in=uuids)
        .all()
    )

    output_dir = Path(settings.MEDIA_ROOT) / "certificate/copy_file"
    output_dir.mkdir(parents=True, exist_ok=True)

    success_results: List[Dict[str, str]] = []
    failed_results: List[Dict[str, str]] = []

    for cert in certificates:
        try:
            issue_number_safe = cert.issue_number.replace("/", "-")

            # ── 1) 기존 copy_file 파일·Field 초기화 ────────────────────
            if cert.copy_file and cert.copy_file.name:
                _safe_remove_file(Path(cert.copy_file.path))
                cert.copy_file.delete(save=False)

            # ── 2) PDF 생성 & 임시 저장 ────────────────────────────────
            pdf_path = generate_certificate_pdf(cert, output_dir)

            # ── 3) FileField 저장 (랜덤 접미사 없이) ────────────────────
            with transaction.atomic():
                save_certificate_pdf(cert, pdf_path)
                cert.save(update_fields=["copy_file"])

            success_results.append(
                {
                    "user_name": cert.user.user_name,
                    "issue_number": cert.issue_number,
                    "copy_file": cert.copy_file.url,
                }
            )

        except Exception as exc:
            failed_results.append(
                {
                    "user_name": cert.user.user_name,
                    "issue_number": cert.issue_number,
                    "error": str(exc),
                }
            )
            continue

    response_body: Dict[str, object] = {
        "success": success_results,
        "failed": failed_results,
        "summary": {
            "requested": len(uuids),
            "succeeded": len(success_results),
            "failed": len(failed_results),
        },
    }

    http_status = status.HTTP_200_OK if not failed_results else status.HTTP_207_MULTI_STATUS
    return Response(response_body, status=http_status)
