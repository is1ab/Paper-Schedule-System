from dataclasses import dataclass, field

from store.db.model.role import Role


@dataclass
class User:
    id: int | None
    account: str | None
    email: str | None
    name: str | None
    note: str | None
    password: str | None
    blocked: bool
    roles: list[Role] = field(default_factory=list)

    def to_json(self):
        return {
            "id": self.id,
            "account": self.account,
            "email": self.email,
            "name": self.name,
            "note": self.note,
            "blocked": self.blocked,
            "roles": [role.to_json() for role in self.roles]
        }


anonymousUser: User = User(
    id=None,
    account="Anonymous",
    email="anonymous@pps.net",
    name=None,
    note=None,
    password=None,
    blocked=False,
    roles=[{
        "id": "3",
        "name": "Guest"      
    }]
)
