import os
import sys
import time
import threading
from django.apps import AppConfig
from django.conf import settings
from django.core.management import call_command
from watchdog.observers.polling import PollingObserver as Observer
from watchdog.events import FileSystemEventHandler

class CertConfig(AppConfig):
    name = 'api.cert'
    verbose_name = "Certificate Management"

    def ready(self):
        # autoreload 로 인한 다중 실행 방지: 실제 서버 프로세스에서만 실행
        if os.environ.get('RUN_MAIN') != 'true':
            return
        # 워처를 백그라운드 데몬 스레드로 실행
        t = threading.Thread(target=self._start_watcher, daemon=True)
        t.start()

    def _start_watcher(self):
        XLSX_FILENAME = "자격증_발급대장_test.xlsx"
        xlsx_path = os.path.join(settings.MEDIA_ROOT, XLSX_FILENAME)

        class Handler(FileSystemEventHandler):
            def __init__(self):
                super().__init__()
                self._last_run = 0.0
                self._debounce_secs = 1.0

            def on_created(self, event):
                self._maybe_import(event)

            def on_modified(self, event):
                self._maybe_import(event)

            def on_moved(self, event):
                # 이동 이벤트의 최종 경로(dest_path)로 src_path 설정
                event.src_path = getattr(event, 'dest_path', event.src_path)
                self._maybe_import(event)

            def on_deleted(self, event):
                # 삭제 이벤트는 무시
                pass

            def _maybe_import(self, event):
                # 정확히 우리가 감시하는 파일만 처리
                if event.src_path != xlsx_path:
                    return

                # 1초 디바운스
                now = time.time()
                if now - self._last_run < self._debounce_secs:
                    return
                self._last_run = now

                print(f"[🔄 Watcher] 감지: {event.event_type} → {event.src_path}")
                sys.stdout.flush()
                try:
                    call_command("import_certificates")
                except Exception as e:
                    print(f"[⚠️ Watcher] import_certificates 오류: {e}")
                    sys.stdout.flush()

        observer = Observer()
        observer.schedule(Handler(), path=settings.MEDIA_ROOT, recursive=False)
        observer.start()

        print(f"[🔍 Watcher] PollingObserver 기반 실시간 Excel 감시 시작 ({settings.MEDIA_ROOT})")
        sys.stdout.flush()

        try:
            while True:
                time.sleep(5)
        except KeyboardInterrupt:
            observer.stop()