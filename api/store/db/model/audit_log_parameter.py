from dataclasses import dataclass

@dataclass
class AuditLogParameter:
    auditLogId: str
    parameterName: str
    parameterValue: str
    id: str = ""

