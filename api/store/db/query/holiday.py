from typing import Any

from psycopg.rows import dict_row

from store.db.db import create_cursor
from store.db.model.holiday import Holiday


def add_holiday(holiday: Holiday):
    with create_cursor() as cursor:
        sql: str = """
            INSERT INTO public.holiday
            ("name", "date")
            VALUES(%s, %s);  
            """
        cursor.execute(sql, (holiday.name, holiday.date))


def get_holidays() -> list[Holiday]:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            SELECT id, "name", "date"
            FROM public.holiday;
            """
        cursor.execute(sql)
        results: list[dict[str, Any]] = cursor.fetchall()
        return [
            Holiday(id=result["id"], name=result["name"], date=result["date"])
            for result in results
        ]


def delete_holiday(date: str):
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            DELETE FROM public.holiday
            WHERE "date"=%s;
            """
        cursor.execute(sql, (date,))
