from dataclasses import dataclass, field
from typing import Dict


@dataclass
class LicenseRegistry:
    """자격과정으로 등록번호과 주무부처를 매핑하여 반환"""
    _table: Dict[str, str] = field(default_factory=dict)

    def register(self, course: str, reg_num: str, ministry: str):
        self._table[course.strip()] = f"제{reg_num}({ministry})"

    def get(self, course: str) -> str | None:
        return self._table.get(course.strip())


# ── 전역 인스턴스 ────────────────────────────────────────────
LICENSES = LicenseRegistry()

# 초기 데이터 등록
_data = [
    ("자격과정1", "2025-111111", "주무부처1"),
    ("자격과정2", "2025-222222", "주무부처2"),
    ("자격과정3", "2025-333333", "주무부처3"),
    ("자격과정4", "2025-444444", "주무부처4"),
    ("자격과정5", "2025-555555", "주무부처5"),
    ("자격과정6", "2025-666666", "주무부처6"),
]

for c, n, m in _data:
    LICENSES.register(c, n, m)
