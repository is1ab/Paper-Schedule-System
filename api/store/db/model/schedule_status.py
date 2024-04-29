from typing import Final

from dataclasses import dataclass


@dataclass
class ScheduleStatus:
    id: str
    name: str

    def to_json(self):
        return {"id": self.id, "name": self.name}
