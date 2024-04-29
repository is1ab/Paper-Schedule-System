from http import HTTPStatus
from typing import Any
from uuid import uuid4

from flask import Blueprint, make_response, request

import store.db.query.holiday as holiday_db
import store.db.query.host_rule as host_rule_db
import store.db.query.schedule as schedule_db
import store.db.query.user as user_db
from store.db.db import create_transection
from auth.jwt_util import decode_jwt, fetch_token
from route_util import audit_route
from schedule.util import generate_schedule, generate_host_rule_pending_schedules
from store.db.model.holiday import Holiday
from store.db.model.host_rule import HostRule
from store.db.model.schedule import Schedule
from store.db.model.schedule_attachment import ScheduleAttachment
from store.db.model.schedule_status import ScheduleStatus
from store.db.model.user import User
from store.storage.real import RealStorage
from store.storage.temp import TempStorage
from store.storage.tunnel_type import TunnelCode
from util import make_single_message_response

schedule_bp = Blueprint("schedule", __name__, url_prefix="/api/schedule")


@audit_route(schedule_bp, "/", methods=["GET"])
def get_all_schedules():
    results: list[Schedule] = generate_schedules()

    return make_response(
        {
            "status": "OK",
            "data": [result.to_json_without_attachment() for result in results],
        }
    )


@audit_route(schedule_bp, "/<schedule_uuid>", methods=["GET"])
def get_schedule(schedule_uuid: str):
    results: list[Schedule] = generate_schedules()
    print(results)
    schedule: Schedule | None = next(
        (schedule for schedule in results if str(schedule.id) == schedule_uuid), None
    )

    if schedule == None:
        return make_single_message_response(HTTPStatus.FORBIDDEN, "Absent schedule.")

    return make_response({"status": "OK", "data": schedule.to_json()})


@audit_route(schedule_bp, "/check/duplicate_url", methods=["POST"])
def check_duplicate_url():
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    url: str = payload["url"]
    schedule1: Schedule | None = schedule_db.get_schedule_by_url(url)
    schedule2: Schedule | None = schedule_db.get_schedule_by_url(url + "/")

    if schedule1 is not None or schedule2 is not None:
        return make_single_message_response(HTTPStatus.FORBIDDEN, "URL already exists.")

    return make_response({"status": "OK"})


@audit_route(schedule_bp, "/", methods=["POST"])
def add_schedule():
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    jwt: str = fetch_token(request.headers.get("Authorization"))
    jwt_payload: dict[str, Any] = decode_jwt(jwt)

    user_object: User = user_db.get_user(jwt_payload["studentId"])
    schedule_status: ScheduleStatus = schedule_db.get_schedule_status("1")

    # Handle attachment copy
    for attachment in payload["attachments"]:
        fileKey: str = attachment["fileKey"]
        temp_storage = TempStorage(TunnelCode.ATTACHMENT)
        if not temp_storage.check_exists(file_name=fileKey, file_type="pdf"):
            return make_single_message_response(
                HTTPStatus.FORBIDDEN, f"File {fileKey} not exists."
            )
        else:
            file_content = temp_storage.read_file_bytes(
                file_name=fileKey, file_type="pdf"
            )
            real_storage = RealStorage(TunnelCode.ATTACHMENT)
            real_storage.touch_file(file_name=fileKey, file_type="pdf")
            real_storage.write_file_bytes(
                file_name=fileKey, file_type="pdf", data=file_content
            )

    # Handle SQL Data Insertion
    with create_transection() as (connection, transection):
        schedule = Schedule(
            name=payload["name"],
            link=payload["link"],
            description=payload["description"],
            status=schedule_status,
            user=user_object,
        )
        schedule_id: str = schedule_db.add_schedule_with_no_commit(connection, schedule)

        attachments = [
            ScheduleAttachment(
                schedule_id=schedule_id,
                file_real_name=attachment["realName"],
                file_virtual_name=attachment["fileKey"],
                file_type="pdf",
            )
            for attachment in payload["attachments"]
        ]

        for attachment in attachments:
            schedule_db.add_schedule_attachments_with_no_commit(connection, attachment)

    return make_response(
        {
            "status": "OK",
            "message": f"Payload added. key={schedule_id}, attachment_count={len(attachments)}",
        }
    )


@audit_route(schedule_bp, "/<schedule_uuid>", methods=["PUT"])
def modified_schedule(schedule_uuid: str):
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    schedule = schedule_db.get_schedule(schedule_uuid)
    new_schedule = Schedule(
        id=schedule.id,
        name=payload["name"],
        link=payload["link"],
        description=payload["description"],
        status=schedule.status,
        user=schedule.user,
        attachments=schedule.attachments,
        schedule_datetime=schedule.schedule_datetime,
        archived=payload["archived"],
    )

    schedule_db.modify_schedule(new_schedule)

    return make_response({"status": "OK", "message": f"Payload modified."})


@audit_route(schedule_bp, "/upload_attachment", methods=["POST"])
def upload_attachment():
    data: bytes = request.get_data()

    file_uuid: str = str(uuid4())
    with open(f"/tmp/pss/attachment/{file_uuid}.pdf", "wb") as file:
        file.write(data)

    return make_response({"status": "OK", "data": f"{file_uuid}"})


@audit_route(schedule_bp, "/put_off", methods=["POST"])
def put_off_schedule():
    return make_response({"status": "Not Implemented."})


def generate_schedules() -> list[Schedule]:
    arranged_schedules: list[Schedule] = schedule_db.get_schedules()
    holidays: list[Holiday] = holiday_db.get_holidays()
    host_rules: list[HostRule] = host_rule_db.get_host_rules()
    results: list[Schedule] = generate_schedule(arranged_schedules, holidays)

    for host_rule in host_rules:
        arranged_host_rule_schedules: list[
            Schedule
        ] = schedule_db.get_arranged_schedules_by_specific_host_rule(host_rule.id)
        users: User = host_rule_db.get_host_rule_users(host_rule.id)
        pending_schedules: list[Schedule] = generate_host_rule_pending_schedules(
            host_rule, users, arranged_host_rule_schedules, holidays
        )
        results.extend(pending_schedules)

    return results
