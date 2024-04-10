from typing import Any, List

from psycopg import Connection
from psycopg.rows import dict_row

import store.db.query.audit_log_parameter as audit_log_parameter_db
from store.db.db import create_cursor
from store.db.model.action import Action
from store.db.model.audit_log import AuditLog
from store.db.model.user import User
from store.db.model.role import Role
from store.db.query.action import get_action
from store.db.query.user import get_user

def get_audit_logs() -> list[AuditLog]:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select al.*, 
            a."type" as "actionType", a."messagePattern" as "actionMessagePattern",
            u."name" as "userName", u.email as "userEmail", u.account as "userAccount"
            from audit_log al
            join "action" a on al."actionId" = a.id
            left join "user" u on u.id = al."userId" 
            order by "createTime" desc
        """
        cursor.execute(sql)
        results: list[dict[str, Any]] = cursor.fetchall()
        cursor.close()
        result_list = []
        for result in results:
            parameters = audit_log_parameter_db.get_audit_log_parameters(result["id"])
            result_list.append(
                AuditLog(
                    id=result["id"],
                    action=Action(
                        id=result["actionId"],
                        type=result["actionType"],
                        messagePattern=result["actionMessagePattern"]
                    ),
                    user=User(
                        id=result["userId"],
                        account=result["userAccount"],
                        email=result["userEmail"],
                        name=result["userName"],
                        note=None,
                        blocked=None,
                        role=Role(
                            id=0,
                            name="unknown"
                        )
                    ),
                    ip=result["ip"],
                    createTime=result["createTime"],
                    parameters=parameters
                )
            )
        return result_list

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
        parameters = audit_log_parameter_db.get_audit_log_parameters(result["id"])
        return AuditLog(
            id=result["id"],
            action=action,
            user=user,
            ip=result["ip"],
            createTime=result["createTime"],
            parameters=parameters
        )

def add_aduit_log_without_commit(connection: Connection, audit_log: AuditLog) -> None:
    try:
        with connection.cursor() as cursor:
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