import traceback

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