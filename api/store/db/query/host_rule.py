from typing import Any

from psycopg.rows import dict_row

from store.db.db import Connection, create_cursor
from store.db.model.host_rule import HostRule

def add_host_rule_without_commit(hostRule: HostRule, connection: Connection) -> int:
    try:
        with connection.cursor() as cursor:
            sql: str = """
                INSERT INTO public.host_rule
                ("name", "startDate", "endDate", "period", weekday, "rule", deleted)
                VALUES(%s, %s, %s, %s, %s, %s, %s)
                RETURNING "id"
            """
            cursor.execute(sql, (
                hostRule.name,
                hostRule.startDate,
                hostRule.endDate,
                hostRule.period,
                hostRule.weekday,
                hostRule.rule,
                hostRule.deleted
            ))
            id: int = cursor.fetchone()[0]
            cursor.close()
            return id
    except Exception as e:
        connection.rollback()
        raise e


def add_host_rule_user_without_commit(hostRuleId: int, users: list[str], connection: Connection):
    try:
        with connection.cursor() as cursor:
            sql: str = """
                INSERT INTO public.host_rule_user
                ("hostRuleId", "account")
                VALUES (%s, %s);
            """
            cursor.executemany(sql, [(hostRuleId, user) for user in users])
            cursor.close()
    except Exception as e:
        connection.rollback()
        raise e 
    

def get_host_rules() -> list[HostRule]:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            SELECT id, "name", "startDate", "endDate", "period", weekday, "rule", deleted
            FROM public.host_rule;
        """
        cursor.execute(sql)
        results: list[dict[str, Any]] = cursor.fetchall()
        return [HostRule(
            name=result["name"],
            startDate=result["startDate"],
            endDate=result["endDate"],
            period=result["period"],
            weekday=result["weekday"],
            rule=result["rule"],
            deleted=result["deleted"]
        ) for result in results]
