from flask import Blueprint

import store.db.query.aduit_log as audit_log_bp
import store.db.query.audit_log_parameter as audit_log_parameter_bp
from route_util import audit_route
from store.db.model.audit_log import AuditLog
from store.db.model.audit_log_parameter import AuditLogParameter

audit_bp = Blueprint("audit", __name__, url_prefix="/api/audit")

@audit_route(audit_bp, "/", methods=["GET"])
def get_audit_log():
    audit_logs: list[AuditLog] = audit_log_bp.get_audit_logs()
    return [audit_log.to_json() for audit_log in audit_logs]

