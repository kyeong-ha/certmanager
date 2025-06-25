import os
from pathlib import Path

from django.core.management.base import BaseCommand
from django.conf import settings
from utils.photo_synchronizer import synchronize_all_certificates

class Command(BaseCommand):
    help = "파일시스템을 스캔하여 Certificate.photo 필드를 자동으로 채웁니다."

    def handle(self, *args, **options):
        media_root = Path(settings.MEDIA_ROOT)
        online_dir = media_root / "images"
        offline_base = media_root

        updated = synchronize_all_certificates()
        self.stdout.write(self.style.SUCCESS(f"완료 – 총 {updated}건 업데이트됨"))
       