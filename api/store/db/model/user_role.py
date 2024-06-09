from dataclasses import dataclass

@dataclass
class UserRole:
    account: str
    roleId: int

    def to_json(self):
        return {
            "account": self.account,
            "roleId": self.roleId
        }