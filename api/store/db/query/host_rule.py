from typing import Any, Tuple

from psycopg.rows import dict_row

from store.db.db import Connection, create_cursor
from store.db.model.host_rule import HostRule, HostRuleOrder, HostRuleSchedule, HostRuleTemporaryEvent
from store.db.model.role import Role
from store.db.model.user import User


def add_host_rule_without_commit(hostRule: HostRule, connection: Connection) -> int:
    try:
        with connection.cursor() as cursor:
            sql: str = """
                INSERT INTO public.host_rule
                ("name", "startDate", "endDate", "period", weekday, "rule", deleted)
                VALUES(%s, %s, %s, %s, %s, %s, %s)
                RETURNING "id"
            """
            cursor.execute(
                sql,
                (
                    hostRule.name,
                    hostRule.startDate,
                    hostRule.endDate,
                    hostRule.period,
                    hostRule.weekday,
                    hostRule.rule,
                    hostRule.deleted,
                ),
            )
            id: int = cursor.fetchone()[0]
            cursor.close()
            return id
    except Exception as e:
        connection.rollback()
        raise e


def add_host_rule_user_without_commit(
    orders: list[HostRuleOrder], connection: Connection
):
    try:
        with connection.cursor() as cursor:
            sql: str = """
                INSERT INTO public.host_rule_user
                ("hostRuleId", "account", "index")
                VALUES (%s, %s, %s);
            """
            cursor.executemany(
                sql,
                [(order.host_rule_id, order.account, order.index) for order in orders],
            )
            cursor.close()
    except Exception as e:
        connection.rollback()
        raise e


def get_host_rule(host_rule_id: int) -> HostRule:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            SELECT id, "name", "startDate", "endDate", "period", weekday, "rule", deleted
            FROM public.host_rule
            WHERE id=%s
        """
        cursor.execute(sql, (host_rule_id,))
        result: list[dict[str, Any]] = cursor.fetchone()
        return HostRule(
            id=result["id"],
            name=result["name"],
            startDate=result["startDate"],
            endDate=result["endDate"],
            period=result["period"],
            weekday=result["weekday"],
            rule=result["rule"],
            deleted=result["deleted"],
        )


def get_host_rules() -> list[HostRule]:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            SELECT id, "name", "startDate", "endDate", "period", weekday, "rule", deleted
            FROM public.host_rule;
        """
        cursor.execute(sql)
        results: list[dict[str, Any]] = cursor.fetchall()
        return [
            HostRule(
                id=result["id"],
                name=result["name"],
                startDate=result["startDate"],
                endDate=result["endDate"],
                period=result["period"],
                weekday=result["weekday"],
                rule=result["rule"],
                deleted=result["deleted"],
            )
            for result in results
        ]


def get_host_rule_and_iteration_with_schedule_id(
    schedule_id: str,
) -> Tuple[HostRule, int] | None:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            SELECT id, "name", "startDate", "endDate", "period", weekday, "rule", deleted, hrs.iteration, hrs."scheduleId"
            FROM public.host_rule
            join host_rule_schedule hrs on hrs."hostRuleId" = id
            where hrs."scheduleId" = %s
        """
        cursor.execute(sql, (schedule_id,))
        result: list[dict[str, Any]] | None = cursor.fetchone()

        if result is None:
            return None

        iteration: int = result["iteration"]
        return (
            HostRule(
                id=result["id"],
                name=result["name"],
                startDate=result["startDate"],
                endDate=result["endDate"],
                period=result["period"],
                weekday=result["weekday"],
                rule=result["rule"],
                deleted=result["deleted"],
            ),
            iteration,
        )


def get_host_rule_users(host_rule_id: int) -> list[User]:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            SELECT hur."hostRuleId", hur.account, 
            u.id, u."name", u.email, u."note", u."blocked", u."role", 
            r."name" as "roleName"
            FROM public.host_rule_user hur
            JOIN "user" u ON u.account = hur.account
            join "role" r on u."role" = r.id 
            where hur."hostRuleId" = %s;
        """
        cursor.execute(sql, (host_rule_id,))
        results: list[dict[str, Any]] = cursor.fetchall()
        return [
            User(
                id=result["id"],
                name=result["name"],
                account=result["account"],
                email=result["email"],
                note=result["note"],
                blocked=result["blocked"],
                role=Role(id=result["role"], name=result["roleName"]),
            )
            for result in results
        ]


def add_host_rule_schedule_without_commit(
    host_rule_schedule: HostRuleSchedule, connection: Connection
):
    try:
        with connection.cursor() as cursor:
            sql: str = """
                INSERT INTO public.host_rule_schedule
                ("hostRuleId", iteration, "scheduleId")
                VALUES(%s, %s, %s);
            """
            cursor.execute(
                sql,
                (
                    host_rule_schedule.host_rule_id,
                    host_rule_schedule.iteration,
                    host_rule_schedule.schedule_id,
                ),
            )
    except Exception as e:
        connection.rollback()
        raise e
    

def add_temporary_event_without_commit(
    temporary_event: HostRuleTemporaryEvent, connection: Connection
):
    try:
        with connection.cursor() as cursor:
            sql: str = """
                INSERT INTO public.host_rule_temporary_event
                ("hostRuleId", "scheduleId", "isReplace")
                VALUES(%s, %s, %s);
            """
            cursor.execute(
                sql,
                (
                    temporary_event.host_rule_id,
                    temporary_event.schedule_id,
                    temporary_event.is_replace
                )
            )
    except Exception as e:
        connection.rollback()
        raise e


def get_temporary_events(host_rule_id: int) -> list[HostRuleTemporaryEvent]:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            SELECT "hostRuleId", "scheduleId", "isReplace"
            FROM public.host_rule_temporary_event
            WHERE "hostRuleId" = %s
        """
        cursor.execute(
            sql,
            (host_rule_id, )
        )
        results: list[dict[str, Any]] = cursor.fetchall()
        return [
            HostRuleTemporaryEvent(
                host_rule_id=result["hostRuleId"],
                schedule_id=result["scheduleId"],
                is_replace=result["isReplace"]
            ) for result in results
        ]