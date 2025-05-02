from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now
from django.conf import settings
import os

from api.cert.models.Certificate import Certificate
from api.cert.serializers.CertificateSerializer import CertificateSerializer
from utils.word_generator import generate_certificate_document  # (우리가 만들 util 함수)

@api_view(['POST'])
def issue_certificates(request):
    """
    선택된 uuid 리스트를 받아 자격증을 발급한다.
    """
    uuids = request.data.get('uuids', [])

    if not uuids or not isinstance(uuids, list):
        return Response({'error': '발급할 자격증 uuid 리스트가 필요합니다.'}, status=status.HTTP_400_BAD_REQUEST)

    certificates = Certificate.objects.select_related('user', 'education_center').filter(uuid__in=uuids)

    if not certificates.exists():
        return Response({'error': '해당하는 자격증이 존재하지 않습니다.'}, status=status.HTTP_404_NOT_FOUND)

    # 저장할 폴더 준비
    output_dir = os.path.join(settings.MEDIA_ROOT, "certificates")
    os.makedirs(output_dir, exist_ok=True)

    results = []

    for cert in certificates:
        try:
            # Word + PDF 파일 생성
            file_base_name = cert.issue_number.replace("/", "-")  # 파일명 안전하게
            word_path, pdf_path = generate_certificate_document(cert, output_dir, file_base_name)

            # 자격증 모델 업데이트 (pdf_url 저장)
            cert.pdf_url = f"certificates/{os.path.basename(pdf_path)}"
            cert.issue_date = now().date()
            cert.save()

            results.append({
                'user_name': cert.user.user_name,
                'issue_number': cert.issue_number,
                'pdf_url': cert.pdf_url,
            })
        except Exception as e:
            return Response({'error': f'자격증 발급 실패: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'message': f'{len(results)}개 자격증 발급 성공', 'details': results}, status=status.HTTP_200_OK)
