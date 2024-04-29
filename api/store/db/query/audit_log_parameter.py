from typing import Any, List

from psycopg import Connection
from psycopg.rows import dict_row

from store.db.db import create_cursor
from store.db.model.audit_log_parameter import AuditLogParameter


def get_audit_log_parameters(audit_log_id: str):
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            SELECT id, "auditLogId", "parameterName", "parameterValue"
            FROM public.audit_log_parameter
            WHERE "auditLogId" = %s;
        """
        cursor.execute(sql, (audit_log_id,))
        results: list[dict[str, Any]] = cursor.fetchall()
        return [
            AuditLogParameter(
                id=result["id"],
                auditLogId=result["auditLogId"],
                parameterName=result["parameterName"],
                parameterValue=result["parameterValue"],
            )
            for result in results
        ]


def add_audit_log_parameter_without_commit(
    connection: Connection, parameter: AuditLogParameter
):
    try:
        with connection.cursor() as cursor:
            sql: str = """
                INSERT INTO public.audit_log_parameter
                ("auditLogId", "parameterName", "parameterValue")
                VALUES(%s, %s, %s)
                RETURNING id;
            """
            cursor.execute(
                sql,
                (
                    parameter.auditLogId,
                    parameter.parameterName,
                    parameter.parameterValue,
                ),
            )
            id: str = cursor.fetchone()[0]
            return id
    except Exception:
        cursor.connection.rollback()
