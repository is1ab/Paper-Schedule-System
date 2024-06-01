from datetime import datetime
from functools import wraps
from typing import Any, Callable, TypeVar

from flask import Blueprint, Response, request

import store.db.db as db
import store.db.query.action as action_db
import store.db.query.aduit_log as audit_log_db
import store.db.query.audit_log_parameter as audit_log_parameter_db
import store.db.query.user as user_db
from auth.jwt_util import decode_jwt, fetch_token, is_jwt_valid
from store.db.model.action import Action
from store.db.model.audit_log import AuditLog
from store.db.model.audit_log_parameter import AuditLogParameter
from store.db.model.user import User, anonymousUser


T = TypeVar("T")


def record_request_audit_log(
    func: Callable[..., Response | T]
) -> Callable[..., Response | T]:
    @wraps(func)
    def wrapper(*args, **kwargs) -> Response | T:
        jwt: str = fetch_token(request.headers.get("Authorization"))
        user: User = anonymousUser
        action: Action = action_db.get_action("56b89550-33b1-41b9-ab5b-61f20e2bddf5")

        if jwt != "" and is_jwt_valid(jwt):
            jwt_payload: dict[str, Any] = decode_jwt(jwt)
            user = user_db.get_user(jwt_payload["studentId"])

        with db.create_transection() as (connection, transection):
            audit_log: AuditLog = AuditLog(
                action=action,
                user=user,
                createTime=datetime.now(),
                ip=request.remote_addr,
            )

            audit_log_id: str = audit_log_db.add_aduit_log_without_commit(
                connection, audit_log
            )

            route_aduit_parameter: AuditLogParameter = AuditLogParameter(
                auditLogId=audit_log_id,
                parameterName="route",
                parameterValue=request.path,
            )

            user_aduit_parameter: AuditLogParameter = AuditLogParameter(
                auditLogId=audit_log_id,
                parameterName="user",
                parameterValue=f"{user.name} <{user.email}>",
            )

            audit_log_parameter_db.add_audit_log_parameter_without_commit(
                connection, route_aduit_parameter
            )
            audit_log_parameter_db.add_audit_log_parameter_without_commit(
                connection, user_aduit_parameter
            )

        return func(*args, **kwargs)

    return wrapper


def audit_route(blueprint: Blueprint, path: str, methods: list[str]):
    def decorator(func):
        @wraps(func)
        @blueprint.route(path, methods=methods)
        @record_request_audit_log
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)

        return wrapper

    return decorator
