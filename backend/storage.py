import json
import os
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
ENTRIES_FILE = DATA_DIR / "entries.json"


class Storage:
    def __init__(self):
        DATA_DIR.mkdir(exist_ok=True)
        if not ENTRIES_FILE.exists():
            ENTRIES_FILE.write_text("{}")

    def _read(self) -> dict:
        try:
            return json.loads(ENTRIES_FILE.read_text())
        except Exception:
            return {}

    def _write(self, data: dict):
        ENTRIES_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False))

    def load_all(self) -> dict:
        return self._read()

    def load_entry(self, date_str: str) -> dict | None:
        return self._read().get(date_str)

    def save_entry(self, date_str: str, entry: dict):
        data = self._read()
        data[date_str] = entry
        self._write(data)

    def delete_entry(self, date_str: str):
        data = self._read()
        data.pop(date_str, None)
        self._write(data)
