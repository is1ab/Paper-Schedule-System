from dataclasses import dataclass

@dataclass
class User:
    id: int
    account: str
    email: str
    name: str
    note: str
    blocked: bool
    role: str

    def to_json(self):
        return {
            "id": self.id,
            "account": self.account,
            "email": self.email,
            "name": self.name,
            "note": self.note,
            "blocked": self.blocked,
            "role": self.role
        }