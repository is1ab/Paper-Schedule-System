from typing import Any, List

from psycopg.rows import dict_row

from store.db.db import create_cursor
from store.db.model.action import Action


def get_action(actionId: str):
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select * from action where id=%s     
        """
        cursor.execute(sql, (actionId,))
        result: dict[str, Any] = cursor.fetchone()
        cursor.close()
        return Action(
            id=result["id"],
            type=result["type"],
            messagePattern=result["messagePattern"],
        )
