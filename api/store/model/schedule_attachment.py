from dataclasses import dataclass

@dataclass
class ScheduleAttachment:
    id: str
    scheduleId: str
    fileName: str
    fileType: str

    def to_json(self):
        return {
            "id": self.id,
            "name": self.fileName,
            "type": self.fileType
        }