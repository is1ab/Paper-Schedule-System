from store.db.db import Connection, create_cursor
from store.db.model.host_rule import HostRule

def add_host_rule_without_commit(hostRule: HostRule, connection: Connection) -> int:
    try:
        with connection.cursor() as cursor:
            sql: str = """
                INSERT INTO public.host_rule
                ("name", "startDate", "endDate", "period", weekday, "rule", deleted)
                VALUES(%s, %s, %s, %d, %d, %s, %r)
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
    except Exception:
        connection.rollback()


def add_host_rule_user_without_commit(hostRuleId: int, users: list[str], connection: Connection):
    try:
        with connection.cursor() as cursor:
            sql: str = """
                INSERT INTO public.host_rule_user
                ("hostRuleId", "userId")
                VALUES (%d, %d);
            """
            cursor.executemany(sql, [(hostRuleId, user) for user in users])
            cursor.close()
    except Exception:
        connection.rollback()