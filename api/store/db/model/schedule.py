from dataclasses import field, dataclass
from datetime import datetime
from typing import Any, List

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

    def get_format_datetime(self):
        return None if self.schedule_datetime == None else self.schedule_datetime.isoformat()

    def to_json(self):
        json: dict[str, Any] = self.to_json_without_attachment()
        json |= {"attachment": [attachment.to_json() for attachment in self.attachments]}
        return json
    
    def to_json_without_attachment(self):
        return {
            "id": self.id,
            "name": self.name,
            "link": self.link,
            "description": self.description,
            "datetime": self.get_format_datetime(),
            "status": self.status.to_json(),
            "user": self.user.to_json(),
        }
    
def convert_schedule_by_dict_data(data: dict[str, Any], user=None, attachments=[]) -> Schedule:
    return Schedule(
        id=data["id"],
        name=data["name"],
        link=data["link"],
        description=data["description"],
        schedule_datetime=data["date"],
        status=ScheduleStatus(
            id=data["statusId"],
            name=data["statusName"]
        ),
        user=user,
        attachments=attachments
    )