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
            "deleted": self.deleted,
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
            "index": self.index,
        }


@dataclass
class HostRuleSchedule:
    host_rule_id: int
    iteration: int
    schedule_id: str

    def to_json(self):
        return {
            "hostRuleId": self.host_rule_id,
            "iteration": self.iteration,
            "scheduleId": self.schedule_id,
        }


@dataclass
class HostRuleSwapRecord:
    host_rule_id: int
    specific_user_account: str
    specific_iteration: int
    swap_user_account: str
    swap_iteration: str
    id: int | None = None

    def to_json(self):
        return {
            "hostRuleId": self.host_rule_id,
            "specificUserId": self.specific_user_account,
            "specificIteration": self.specific_iteration,
            "swapUserId": self.specific_user_account,
            "swapIteration": self.swap_iteration
        }
    

@dataclass
class HostRuleTemporaryEvent:
    host_rule_id: int
    schedule_id: str
    is_replace: bool

    def to_json(self):
        return {
            "hostRuleId": self.host_rule_id,
            "scheduleId": self.schedule_id,
            "isReplace": self.is_replace
        }