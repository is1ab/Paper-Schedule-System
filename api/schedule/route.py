from http import HTTPStatus
from typing import Any
from urllib.parse import urlparse

from flask import Blueprint, make_response, request

import store.query.schedule as schedule_db
import store.query.user as user_db
from auth.jwt_util import decode_jwt, fetch_token
from store.model.schedule import Schedule
from store.model.schedule_status import ScheduleStatus
from store.model.user import User
from util import make_single_message_response

schedule_bp = Blueprint("schedule", __name__, url_prefix="/api/schedule")


@schedule_bp.route("/", methods=["GET"])
def get_all_schedules():
    schedules: list[Schedule] = schedule_db.get_schedules()
    return make_response({"status": "OK", "data": [schedule for schedule in schedules]})


@schedule_bp.route("/<schedule_uuid>", methods=["GET"])
def get_schedule(schedule_uuid: str):
    schedule: Schedule | None = schedule_db.get_schedule(schedule_uuid)
    assert schedule is not None

    return make_response({"status": "OK", "data": schedule.to_json()})


@schedule_bp.route("/check/duplicate_url", methods=["GET"])
def check_duplicate_url():
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    url: str = payload["url"]
    schedule1: Schedule | None = schedule_db.get_schedule_by_url(url)
    schedule2: Schedule | None = schedule_db.get_schedule_by_url(url + "/")

    if schedule1 is not None or schedule2 is not None:
        return make_single_message_response(HTTPStatus.FORBIDDEN, "URL already exists.")
    
    return make_response({"status": "OK"})


@schedule_bp.route("/", methods=["POST"])
def add_schedule():
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    jwt: str = fetch_token(request.headers.get("Authorization"))
    jwt_payload: dict[str, Any] = decode_jwt(jwt)

    user_object: User = user_db.get_user(jwt_payload["studentId"])
    schedule_status: ScheduleStatus = schedule_db.get_schedule_status("1")
    schedule = Schedule(
        name=payload["name"],
        link=payload["link"],
        description=payload["description"],
        status=schedule_status,
        user=user_object,
        attachments=[]
    )

    schedule_db.add_schedule(schedule)

    return make_response({"status": "OK", "message": f"Payload added. key={schedule.id}"})


@schedule_bp.route("/<schedule_uuid>", methods=["PUT"])
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
        archived=payload["archived"]
    )

    schedule_db.modify_schedule(new_schedule)

    return make_response({"status": "OK", "message": f"Payload modified."})


@schedule_bp.route("/put_off", methods=["POST"])
def put_off_schedule():
    return make_response({"status": "Not Implemented."})