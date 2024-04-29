from dataclasses import dataclass
from datetime import datetime

from store.db.model.user import User, anonymousUser
from store.db.model.schedule import Schedule, ScheduleStatus


@dataclass
class Holiday:
    name: str
    date: datetime
    id: int = None

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date.strftime("%Y-%m-%d"),
        }

    def to_schedule(self) -> Schedule:
        return Schedule(
            name=self.name,
            link="",
            description="",
            status=ScheduleStatus(5, "放假"),
            user=anonymousUser,
            attachments=[],
            id=self.id,
            schedule_datetime=self.date,
            archived=False,
        )
