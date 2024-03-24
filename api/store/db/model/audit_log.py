from dataclasses import dataclass
from datetime import datetime

from store.db.model.action import Action
from store.db.model.audit_log_parameter import AuditLogParameter
from store.db.model.user import User

@dataclass
class AuditLog:
    action: Action
    user: User
    ip: str
    createTime: datetime
    parameters: list[AuditLogParameter] = None
    id: str = ""

    def to_json(self):
        return {
            "id": self.id,
            "message": _make_message(self.action.messagePattern, self.parameters),
            "action": self.action.to_json(),
            "user": self.user.to_json(),
            "ip": self.ip,
            "parameters": None if self.parameters is None else [parameter.to_json() for parameter in self.parameters],
            "createTime": self.createTime.isoformat()
        }


def _make_message(messagePattern: str, parameters: list[AuditLogParameter]):
    result_message = messagePattern
    for parameter in parameters:
        result_message = result_message.replace("{" + parameter.parameterName + "}", parameter.parameterValue)
    return result_message