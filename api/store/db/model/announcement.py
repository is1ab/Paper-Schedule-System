from dataclasses import dataclass
from datetime import date

@dataclass
class Announcement:
    id: str
    type: str
    description: str
    valid_start_date: date
    valid_end_date: date

    def to_json(self):
        return {
            "id": self.id,
            "type": self.type,
            "description": self.description,
            "valid_start_date": self.valid_start_date.strftime("%Y-%m-%d"),
            "valid_end_date": self.valid_end_date.strftime("%Y-%m-%d")
        }