from dataclasses import dataclass
from datetime import datetime
from typing import List

from store.model.schedule_status import ScheduleStatus
from store.model.schedule_attachment import ScheduleAttachment
from store.model.user import User

@dataclass
class Schedule:
    id: str
    name: str
    link: str
    description: str
    datetime: datetime
    status: ScheduleStatus
    user: User
    attachments: List[ScheduleAttachment]

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "link": self.link,
            "description": self.description,
            "datetime": self.datetime,
            "status": self.status.to_json(),
            "user": self.user.to_json(),
            "attachment": [attachment.to_json() for attachment in self.attachments]
        }