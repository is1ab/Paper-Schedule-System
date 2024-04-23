from dataclasses import dataclass
from datetime import datetime

@dataclass
class Holiday:
    name: str
    date: datetime
    id: int = None

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date.strftime("%Y-%m-%d")
        }