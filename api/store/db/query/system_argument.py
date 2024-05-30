from typing import Any

from psycopg import Connection
from psycopg.rows import dict_row

from store.db.db import create_cursor
from store.db.model.system_argument import SystemArg

def get_system_arguments():
    with create_cursor(row_factory=dict_row) as cursor:
        sql = """
        SELECT "key", value
        FROM public.system_argument;
        """
        cursor.execute(sql)
        results: list[dict[str, Any]] = cursor.fetchall()
        return [
            SystemArg(
                key=result["key"],
                value=result["value"]
            ) for result in results
        ]