from dataclasses import field, dataclass
from datetime import datetime
from typing import Any, List

from store.db.model.schedule_status import ScheduleStatus
from store.db.model.schedule_attachment import ScheduleAttachment
from store.db.model.host_rule import HostRule
from store.db.model.user import User


@dataclass(kw_only=True)
class Schedule:
    name: str
    link: str
    description: str
    status: ScheduleStatus
    user: User | None
    attachments: List[ScheduleAttachment] = field(default_factory=list)
    id: str = ""
    host_rule: HostRule = None
    host_rule_iterator: int = 0
    schedule_datetime: datetime | None = None
    archived: bool = False

    def get_format_datetime(self) -> str | None:
        if self.schedule_datetime == None:
            return None

        return self.schedule_datetime.isoformat()

    def to_json(self):
        json: dict[str, Any] = self.to_json_without_attachment()
        json |= {
            "attachments": [attachment.to_json() for attachment in self.attachments]
        }
        return json

    def to_json_without_attachment(self):
        return {
            "id": self.id,
            "name": self.name,
            "link": self.link,
            "description": self.description,
            "datetime": self.get_format_datetime(),
            "status": self.status.to_json(),
            "user": self.user.to_json() if self.user != None else None,
            "hostRule": self.host_rule.to_json() if self.host_rule != None else None,
            "hostRuleIter": self.host_rule_iterator,
        }


def convert_schedule_by_dict_data(
    data: dict[str, Any], user=None, attachments=[], host_rule=None, host_rule_iter=0
) -> Schedule:
    return Schedule(
        id=data["id"],
        name=data["name"],
        link=data["link"],
        description=data["description"],
        schedule_datetime=data["date"],
        status=ScheduleStatus(id=data["statusId"], name=data["statusName"]),
        user=user,
        host_rule=host_rule,
        host_rule_iterator=host_rule_iter,
        attachments=attachments,
    )
