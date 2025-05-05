import os
import glob
from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.cert.models.Certificate import Certificate
from api.cert.serializers.CertificateSerializer import CertificateSerializer
from utils.generate_certificates import generate_certificate_pdf, save_certificate_pdf


@api_view(['POST'])
def issue(request):
    uuids = request.data.get('uuids', [])
    if not isinstance(uuids, list) or not uuids:
        return Response({'error': 'uuid 리스트가 필요합니다.'}, status=status.HTTP_400_BAD_REQUEST)

    certificates = Certificate.objects.select_related('user', 'education_center').filter(uuid__in=uuids)
    output_dir = os.path.join(settings.MEDIA_ROOT, "certificates")
    os.makedirs(output_dir, exist_ok=True)

    results = []

    for cert in certificates:
        try:
            issue_number = cert.issue_number.replace('/', '-')
            file_name = f"{issue_number}.pdf"
            print(f"🟡 발급 처리 시작: {cert.issue_number}")

            # 기존 copy_file가 이미 저장되어 있으면 삭제 (파일 + FileField)
            if cert.copy_file and cert.copy_file.name:
                try:
                    if os.path.isfile(cert.copy_file.path):
                        os.remove(cert.copy_file.path)
                except Exception as e:
                    print(f"⚠ 기존 파일 삭제 실패: {e}")
                cert.copy_file.delete(save=False)

            # copy_file 생성
            print(f"🔨 copy_file 생성 시작: {cert.issue_number}")
            pdf_path = generate_certificate_pdf(cert, output_dir)
            print(f"✅ copy_file 생성 완료: {pdf_path}")

            # copy_file 저장
            save_certificate_pdf(cert, pdf_path)
            print(f"✅ DB에 copy_file 저장 완료: {cert.copy_file.url}")

            results.append({
                'user_name': cert.user.user_name,
                'issue_number': cert.issue_number,
                'copy_file': cert.copy_file.url,
            })

        except Exception as e:
            return Response({'error': f'{cert.issue_number} 자격증 발급 실패: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({
        'message': f'{len(results)}개 자격증 발급 성공',
        'details': results
    }, status=status.HTTP_200_OK)
