from typing import Any, List

from psycopg.rows import dict_row

from store.db.db import create_cursor
from store.db.model.audit_log_parameter import AuditLogParameter

def add_audit_log_parameter_without_commit(parameter: AuditLogParameter):
    try:
        with create_cursor() as cursor:
            sql: str = """
                INSERT INTO public.audit_log_parameter
                ("auditLogId", "parameterName", "parameterValue")
                VALUES(%s, %s, %s)
                RETURNING id;
            """
            cursor.execute(sql, (
                parameter.auditLogId,
                parameter.parameterName,
                parameter.parameterValue
            ))
            id: str = cursor.fetchone()[0]
            return id
    except Exception:
        cursor.connection.rollback()