from typing import Any

from flask import Blueprint, make_response, request

from firebase.firestore_util import fetch_schedule_from_firebase, fetch_schedules_from_firebase, add_schedule_to_firebase, modified_schedule_to_firebase, remove_schedule_from_firebase

schedule_bp = Blueprint("schedule", __name__, url_prefix="/api/schedule")


@schedule_bp.route("/", methods=["GET"])
def get_all_schedules():
    schedules: list[dict[str, Any]] = fetch_schedules_from_firebase()
    return make_response({"status": "OK", "data": schedules})


@schedule_bp.route("/<id>", methods=["GET"])
def get_schedule(id: str):
    schedule: dict[str, Any] = fetch_schedule_from_firebase(id)
    return make_response({"status": "OK", "data": schedule})


@schedule_bp.route("/", methods=["POST"])
def add_schedule():
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    id: str = add_schedule_to_firebase(payload)

    return make_response({"status": "OK", "message": f"Payload added. key={id}"})


@schedule_bp.route("/<id>", methods=["PUT"])
def modified_schedule(id: str):
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    modified_schedule_to_firebase(id, payload)

    return make_response({"status": "OK", "message": f"Payload modified."})


@schedule_bp.route("/<id>", methods=["DELETE"])
def delete_schedule(id: str):
    remove_schedule_from_firebase(id)
    return make_response({"status": "OK"})


@schedule_bp.route("/put_off", methods=["POST"])
def put_off_schedule():
    return make_response({"status": "Not Implemented."})