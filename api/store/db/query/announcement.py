from datetime import date
from typing import Any

from psycopg.rows import dict_row

from store.db.db import create_cursor
from store.db.model.announcement import Announcement

def get_announcements() -> list[Announcement]:
    current_date = date.today()
    with create_cursor(row_factory=dict_row) as cursor:
        sql = """
        SELECT id, "type", description, "validStartDate", "validEndDate"
        FROM public.announcement
        WHERE "validStartDate" <= %s and "validEndDate" >= %s
        """
        cursor.execute(sql, (
            current_date.strftime("%Y-%m-%d"), 
            current_date.strftime("%Y-%m-%d")
        ))
        results: list[dict[str, Any]] = cursor.fetchall()
        return [
            Announcement(
                id=result["id"],
                type=result["type"],
                description=result["description"],
                valid_start_date=result["validStartDate"],
                valid_end_date=result["validEndDate"]
            ) for result in results
        ]