from typing import Any, List

from psycopg.rows import dict_row

from store.db.db import create_cursor
from store.db.model.action import Action
from store.db.model.audit_log import AuditLog
from store.db.model.user import User
from store.db.query.action import get_action
from store.db.query.user import get_user

def get_audit_log(audit_log_id: str) -> AuditLog:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select * from audit_log where id=%s     
        """
        cursor.execute(sql, (audit_log_id, ))
        result: dict[str, Any] = cursor.fetchone()
        cursor.close()
        user: User = get_user(result["user_id"])
        action: Action = get_action(result)
        return AuditLog(
            id=result["id"],
            action=action,
            user=user,
            ip=result["ip"],
            createTime=result["createTime"]
        )

def add_aduit_log_without_commit(audit_log: AuditLog) -> None:
    try:
        with create_cursor() as cursor:
            sql: str = """
                INSERT INTO public.audit_log
                ("actionId", "userId", ip, "createTime")
                VALUES(%s, %s, %s, %s)
                RETURNING id;
            """
            cursor.execute(sql, (
                audit_log.action.id,
                audit_log.user.id,
                audit_log.ip,
                audit_log.createTime
            ))
            id: str = cursor.fetchone()[0]
            return id
    except Exception:
        cursor.connection.rollback()