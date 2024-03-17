from typing import Any, List

from psycopg.rows import class_row, dict_row

import store.db.query.user as user_db
from store.db import connection
from store.db.model.schedule import Schedule
from store.db.model.schedule_status import ScheduleStatus
from store.db.model.schedule_attachment import ScheduleAttachment
from store.db.model.user import User

def get_schedules() -> List[Schedule]:
    with connection.cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select s.*, ss.id as "statusId", ss.status as "statusName" from schedule s 
            join schedule_status ss on s.status = ss.id
            where s.archived = false
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
            where s.id = %s and s.archived = false
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
            "schedule_datetime": result["date"],
            "status": ScheduleStatus(**{
                "id": result["statusId"],
                "name": result["statusName"]
            }),
            "user": user,
            "attachments": [attachment for attachment in attachments]
        })
    
def get_schedule_by_url(url: str) -> Schedule | None:
    with connection.cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select s.*, ss.id as "statusId", ss.status as "statusName" from schedule s 
            join schedule_status ss on s.status = ss.id 
            where s.link = %s and s.archived = false
            """
        cursor.execute(sql, (url,))
        result: dict[str, Any] | None = cursor.fetchone()

        if result is None:
            return None

        user: User | None = user_db.get_user(result["userId"])
        attachments: List[ScheduleAttachment] = get_schedule_attachments(result["id"])
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
            select sa.* from schedule_attachment sa 
            join schedule s on s.id = sa."scheduleId"
            where sa."scheduleId" = %s and s.archived = false
            """
        cursor.execute(sql, (schedule_uuid,))
        results: List[ScheduleAttachment] = cursor.fetchall()
        return results

def get_schedule_status(schedule_status_id: int) -> ScheduleStatus | None:
    with connection.cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select * from schedule_status ss 
            where ss.id = %s
            """
        cursor.execute(sql, (schedule_status_id,))
        result: dict[str, Any] | None = cursor.fetchone()

        if result == None:
            return None

        return ScheduleStatus(id=result["id"], name=result["status"])

def add_schedule(schedule: Schedule) -> str:
    try:
        with connection.cursor() as cursor:
            sql: str = """
                insert into public.schedule
                ("name", link, description, "date", status, "userId", archived)
                values(%s, %s, %s, %s, %s, %s, %s)
                returning id;
            """
            cursor.execute(sql, (
                schedule.name, 
                schedule.link, 
                schedule.description, 
                schedule.schedule_datetime, 
                schedule.status.id, 
                schedule.user.account, 
                schedule.archived
            ))
            id: str = cursor.fetchone()[0]
            connection.commit()
            return id
    except Exception as e:
        connection.rollback()
        raise e
    
def modify_schedule(schedule: Schedule) -> None:
    try:
        with connection.cursor() as cursor:
            sql: str = """
                update schedule 
                set name=%s, link=%s, description=%s, date=%s, status=%s, "userId"=%s, archived=%s
                where id=%s
            """
            cursor.execute(sql, (
                schedule.name, 
                schedule.link, 
                schedule.description, 
                schedule.schedule_datetime, 
                schedule.status.id, 
                schedule.user.account, 
                schedule.archived,
                schedule.id
            ))
            connection.commit()
    except Exception as e:
        connection.rollback()
        raise e