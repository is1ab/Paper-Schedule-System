from typing import Any
from datetime import datetime
from ipaddress import IPv4Address

from flask import Blueprint, current_app

from store.db.model.action import Action
from store.db.model.user import User
from store.db.query.action import get_action


class AuditLog:
    def __init__(
        self,
        action: str,
        timestamp: datetime,
        ip: IPv4Address,
        user: User,
        action_id: str,
        data: dict[str, Any],
    ):
        self.action = action
        self.timestamp = timestamp
        self.ip = ip
        self.user = user
        self.action_id = action_id
        self.data = data

    def to_json(self):
        action: Action = self._fetch_message(self.action_id)
        return {
            "timestamp": self.timestamp.isoformat(),
            "ip": str(self.ip),
            "user": f"{self.user.name} <{self.user.email}>",
            "action": action.type,
            "actionId": action.id,
            "data": self.data,
        }

    def _fetch_message(action_id: str) -> Action:
        with current_app.app_context():
            action: Action | None = get_action(actionId=action_id)
            assert action is not None
            return action
