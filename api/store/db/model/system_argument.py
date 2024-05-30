from dataclasses import dataclass

@dataclass
class SystemArg:
    key: str
    value: str

    def to_json(self):
        return {
            "key": self.key,
            "value": self.value
        }