from datetime import datetime
from typing import Any, List

from psycopg.rows import class_row, dict_row

import store.query.user as user_db
from store.db import connection
from store.model.schedule import Schedule
from store.model.schedule_status import ScheduleStatus
from store.model.schedule_attachment import ScheduleAttachment
from store.model.user import User

def get_schedules() -> List[Schedule]:
    with connection.cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select s.*, ss.id as "statusId", ss.status as "statusName" from schedule s 
            join schedule_status ss on s.status = ss.id
            """
        cursor.execute(sql)
        results: List[dict[str, Any]] = cursor.fetchall()

        schedule_list: List[Schedule] = []
        for result in results:
            user: User | None = user_db.get_user(result["userId"])
            attachments: List[ScheduleAttachment] = get_schedule_attachments(str(result["id"]))
            schedule_list.append(Schedule(**{
                "id": result["id"],
                "name": result["name"],
                "link": result["link"],
                "description": result["description"],
                "datetime": result["date"],
                "status": ScheduleStatus(**{
                    "id": result["statusId"],
                    "name": result["statusName"]
                }),
                "user": user,
                "attachments": [attachment for attachment in attachments]
            }))
        return schedule_list

def get_schedule(schedule_uuid: str) -> Schedule | None:
    with connection.cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select s.*, ss.id as "statusId", ss.status as "statusName" from schedule s 
            join schedule_status ss on s.status = ss.id 
            where s.id = %s
            """
        cursor.execute(sql, (schedule_uuid,))
        result: dict[str, Any] = cursor.fetchone()
        user: User | None = user_db.get_user(result["userId"])
        attachments: List[ScheduleAttachment] = get_schedule_attachments(schedule_uuid)
        return Schedule(**{
            "id": result["id"],
            "name": result["name"],
            "link": result["link"],
            "description": result["description"],
            "datetime": result["date"],
            "status": ScheduleStatus(**{
                "id": result["statusId"],
                "name": result["statusName"]
            }),
            "user": user,
            "attachments": [attachment for attachment in attachments]
        })


def get_schedule_attachments(schedule_uuid: str) -> List[ScheduleAttachment]:
    with connection.cursor(row_factory=class_row(ScheduleAttachment)) as cursor:
        sql: str = """
            select * from schedule_attachment sa where sa."scheduleId" = %s
            """
        cursor.execute(sql, (schedule_uuid,))
        results: List[ScheduleAttachment] = cursor.fetchall()
        return results