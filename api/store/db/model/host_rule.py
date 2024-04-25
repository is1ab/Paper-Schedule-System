from dataclasses import dataclass
from datetime import datetime

@dataclass
class HostRule:
    name: str
    startDate: datetime
    endDate: datetime
    period: int
    weekday: int
    rule: str
    deleted: bool
    id: int = None

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "startDate": self.startDate.strftime("%Y-%m-%d"),
            "endDate": self.endDate.strftime("%Y-%m-%d"),
            "period": self.period,
            "weekday": self.weekday,
            "rule": self.rule,
            "deleted": self.deleted
        }
    
@dataclass
class HostRuleOrder:
    host_rule_id: int
    account: str
    index: int

    def to_json(self):
        return {
            "host_rule_id": self.host_rule_id,
            "account": self.account,
            "index": self.index
        }