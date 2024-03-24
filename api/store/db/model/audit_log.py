from dataclasses import dataclass
from datetime import datetime

from store.db.model.action import Action
from store.db.model.user import User

@dataclass
class AuditLog:
    action: Action
    user: User
    ip: str
    createTime: datetime
    id: str = ""

    def to_json(self):
        return {
            "id": self.id,
            "action": self.action.to_json(),
            "user": self.user.to_json(),
            "ip": self.ip,
            "createTime": self.createTime.isoformat()
        }
