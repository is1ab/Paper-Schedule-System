from typing import Any, List

from psycopg.rows import dict_row

from store.db.db import create_cursor
from store.db.model.role import Role


def get_role() -> list[Role]:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select r.id as "roleId", r.name as "roleName"
            from "role" r
            order by r.id;     
        """
        cursor.execute(sql)
        results: dict[str, Any] = cursor.fetchall()
        cursor.close()
        return [Role(result["roleId"], result["roleName"]) for result in results]
