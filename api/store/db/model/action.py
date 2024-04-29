from dataclasses import dataclass


@dataclass
class Action:
    id: str
    type: str
    messagePattern: str

    def to_json(self):
        return {"id": self.id, "type": self.type, "messagePattern": self.messagePattern}
