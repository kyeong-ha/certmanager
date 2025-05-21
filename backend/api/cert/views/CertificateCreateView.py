from __future__ import annotations
from typing import List, Dict
from pathlib import Path

from django.conf import settings
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from api.cert.models.Certificate import Certificate
from api.cert.services.generator import generate_certificate_pdf, save_certificate_pdf
from api.cert.serializers.CertificateSerializer import CertificateWriteSerializer, CertificateDetailSerializer


# POST /api/cert/create → PDF 생성 및 파일 저장
@api_view(["POST"])
def create(request):
    """선택된 Certificate 들에 대해 PDF 를 생성하고 copy_file 에 저장하거나, 단일 자격증을 새로 생성한다."""

    # UUID 리스트가 들어온 경우 → PDF 생성
    if isinstance(request.data.get("uuids"), list):
        return _create_cert_pdf_files(request)

    # UUID 리스트가 없고 → 단건 자격증 생성
    return _create_single_certificate(request)


@parser_classes([MultiPartParser, FormParser])
def _create_single_certificate(request):
    serializer = CertificateWriteSerializer(data=request.data)
    if serializer.is_valid():
        certificate = serializer.save()
        return Response(CertificateDetailSerializer(certificate).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# POST /api/cert/create → UUID 리스트 기반 PDF 생성 로직
def _create_cert_pdf_files(request):
    uuids: List[str] = request.data.get("uuids", [])
    certificates = Certificate.objects.select_related("user").filter(uuid__in=uuids)

    output_dir = Path(settings.MEDIA_ROOT) / "certificate/copy_file"
    output_dir.mkdir(parents=True, exist_ok=True)

    success_results: List[Dict[str, str]] = []
    failed_results: List[Dict[str, str]] = []

    for cert in certificates:
        try:
            issue_number_safe = cert.issue_number.replace("/", "-")

            # 기존 파일 삭제
            if cert.copy_file and cert.copy_file.name:
                _safe_remove_file(Path(cert.copy_file.path))
                cert.copy_file.delete(save=False)

            # PDF 생성 및 저장
            pdf_path = generate_certificate_pdf(cert, output_dir)
            with transaction.atomic():
                save_certificate_pdf(cert, pdf_path)
                cert.save(update_fields=["copy_file"])

            success_results.append({
                "user_name": cert.user.user_name,
                "issue_number": cert.issue_number,
                "copy_file": cert.copy_file.url,
            })

        except Exception as exc:
            failed_results.append({
                "user_name": cert.user.user_name,
                "issue_number": cert.issue_number,
                "error": str(exc),
            })
            continue

    return Response({
        "success": success_results,
        "failed": failed_results,
        "summary": {
            "requested": len(uuids),
            "succeeded": len(success_results),
            "failed": len(failed_results),
        }
    }, status=status.HTTP_207_MULTI_STATUS if failed_results else status.HTTP_200_OK)


# 헬퍼: 파일 삭제
def _safe_remove_file(file_path: Path) -> None:
    try:
        if file_path.is_file():
            file_path.unlink()
    except Exception as exc:
        print(f"⚠ 파일 삭제 실패: {file_path} → {exc}")
        
