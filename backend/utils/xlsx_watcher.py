from django.core.management.base import BaseCommand
from django.conf import settings
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os, time, sys

XLSX_FILENAME = "자격증_발급대장.xlsx"

class ExcelChangeHandler(FileSystemEventHandler):
    def __init__(self, stdout, stderr):
        super().__init__()
        self.stdout = stdout
        self.stderr = stderr
        self._last_run = 0.0
        self._debounce_secs = 1.0  # 1초 이내 중복 실행 방지
        
    # 파일 생성 감지
    def on_created(self, event):
        self.handle_event(event)

    # ㅍ파일 수정 감지
    def on_modified(self, event):
        event.src_path = getattr(event, 'dest_path', event.src_path)
        self.handle_event(event)

    # 파일 이동 감지
    def on_moved(self, event):
        # 이동 후 새 경로로 처리
        event.src_path = getattr(event, 'dest_path', event.src_path)
        self.handle_event(event)

    # 파일 삭제 감지
    def on_deleted(self, event):
        pass

    # 공통 이벤트 처리
    def handle_event(self, event):
        xlsx_path = os.path.join(settings.MEDIA_ROOT, XLSX_FILENAME)
        # 정확히 대상 파일에 대해서만
        if event.src_path != xlsx_path:
            return

        # 디바운스: 너무 잦은 호출 방지
        now = time.time()
        if now - self._last_run < self._debounce_secs:
            return
        self._last_run = now

        # 실제 import 실행
        self.stdout.write(f"[🔄 Watcher] 감지: {event.event_type} → {event.src_path}")
        self.stdout.flush()
        try:
            from django.core.management import call_command
            call_command("import_certificates")
        except Exception as e:
            self.stderr.write(f"[⚠️ Watcher] import_certificates 오류: {e}")
            self.stderr.flush()

class Command(BaseCommand):
    help = "자격증_발급대장.xlsx 실시간 감시 및 자동 import 실행"

    def handle(self, *args, **options):
        # 시작 로그
        self.stdout.write("▶▶ 워처 관리 커맨드 시작")
        self.stdout.flush()

        # Observer 설정
        observer = Observer()
        observer.schedule(
            ExcelChangeHandler(self.stdout, self.stderr),
            path=settings.MEDIA_ROOT,
            recursive=False
        )
        observer.start()

        try:
            while True:
                time.sleep(2)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()