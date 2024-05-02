from typing import Any
from flask import Blueprint, make_response, request

import store.db.query.schedule as schedule_db
import store.db.query.host_rule as host_rule_db
from route_util import audit_route
from store.db.db import create_transection
from store.db.model.schedule import Schedule, ScheduleStatus
from store.db.model.host_rule import HostRuleSchedule

schedule_admin_bp = Blueprint(
    "schedule_admin", __name__, url_prefix="/api/admin/schedule"
)


@audit_route(schedule_admin_bp, "/<schedule_uuid>/specificDate", methods=["POST"])
def specific_schedule_date(schedule_uuid: str):
    payload: dict[str, Any] = request.get_json(silent=True)
    schedule: Schedule = schedule_db.get_schedule(schedule_uuid)

    host_rule_id: int = payload["hostRuleId"]
    iteration: int = payload["iteration"]

    with create_transection() as (connection, transection):
        host_rule_db.add_host_rule_schedule_without_commit(
            HostRuleSchedule(
                schedule_id=schedule_uuid,
                host_rule_id=host_rule_id,
                iteration=iteration,
            ),
            connection,
        )
        schedule.status = ScheduleStatus(2, "已完成")
        schedule_db.modify_schedule_without_commit(schedule, connection)

    return make_response({"status": "OK"})
