from dataclasses import dataclass


@dataclass
class ScheduleAttachment:
    schedule_id: str
    file_virtual_name: str
    file_real_name: str
    file_type: str
    id: str = ""

    def to_json(self):
        return {
            "id": self.id,
            "virtualName": self.file_virtual_name,
            "realName": self.file_real_name,
            "type": self.file_type,
        }
