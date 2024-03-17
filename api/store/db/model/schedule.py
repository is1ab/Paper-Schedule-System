from dataclasses import field, dataclass
from datetime import datetime
from typing import List

from store.db.model.schedule_status import ScheduleStatus
from store.db.model.schedule_attachment import ScheduleAttachment
from store.db.model.user import User

@dataclass(kw_only=True)
class Schedule:
    name: str
    link: str
    description: str
    status: ScheduleStatus
    user: User
    attachments: List[ScheduleAttachment] = field(default_factory=list)
    id: str = ""
    schedule_datetime: datetime | None = None
    archived: bool = False

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "link": self.link,
            "description": self.description,
            "datetime": self.schedule_datetime,
            "status": self.status.to_json(),
            "user": self.user.to_json(),
            "attachment": [attachment.to_json() for attachment in self.attachments]
        }