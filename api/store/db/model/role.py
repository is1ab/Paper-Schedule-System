from dataclasses import dataclass


@dataclass
class Role:
    id: int
    name: str

    def to_json(self):
        return {"id": self.id, "name": self.name}
