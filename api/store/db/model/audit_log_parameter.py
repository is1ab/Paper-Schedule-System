from dataclasses import dataclass

@dataclass
class AuditLogParameter:
    auditLogId: str
    parameterName: str
    parameterValue: str
    id: str = ""

    def to_json(self):
        return {
            "id": self.id,
            "auditLogId": self.auditLogId,
            "parameterName": self.parameterName,
            "parameterValue": self.parameterValue,
        }