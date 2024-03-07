from flask import Blueprint, make_response


schedule_bp = Blueprint("schedule", __name__, url_prefix="/api/schedule")


@schedule_bp.route("/", methods=["GET"])
def fetch_all_schedules():
    return make_response({"status": "Not Implemented."})


@schedule_bp.route("/<id>", methods=["GET"])
def fetch_schedule(id: str):
    return make_response({"status": "Not Implemented."})


@schedule_bp.route("/<id>", methods=["POST"])
def add_schedule(id: str):
    return make_response({"status": "Not Implemented."})


@schedule_bp.route("/<id>", methods=["PUT"])
def modified_schedule(id: str):
    return make_response({"status": "Not Implemented."})


@schedule_bp.route("/<id>", methods=["DELETE"])
def delete_schedule(id: str):
    return make_response({"status": "Not Implemented."})


@schedule_bp.route("/put_off", methods=["POST"])
def put_off_schedule():
    return make_response({"status": "Not Implemented."})