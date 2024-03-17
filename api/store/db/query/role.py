from typing import Any, List

from psycopg.rows import dict_row

from store.db import connection
from store.model.role import Role

def get_role():
    with connection.cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select r.id as "roleId", r.name as "roleName"
            from "role" r
            order by r.id;     
        """
        cursor.execute(sql)
        results: dict[str, Any] = cursor.fetchall()
        cursor.close()
        return [Role(
            result["roleId"],
            result["roleName"]
        ) for result in results]