from hashlib import sha256
from http import HTTPStatus
from typing import Any, List

from flask import Blueprint, Response, make_response, request

import store.db.query.user as user_db
import store.db.query.schedule as schedule_db
from auth.jwt_util import fetch_token, decode_jwt
from store.db.model.schedule import Schedule
from store.db.model.user import User
from store.storage import TunnelCode
from store.storage.real import RealStorage
from util import make_single_message_response

user_bp = Blueprint("user", __name__, url_prefix="/api/user")

@user_bp.route("/<account>/", methods=["GET"])
def get_user(account: str):
    user: User | None = user_db.get_user(account)
    assert user is not None
    
    schedules: list[Schedule] = schedule_db.get_schedules_by_user(user)

    result = user.to_json()
    result |= {"schedules": [schedule.to_json() for schedule in schedules]}

    return make_response({"status": "OK", "data": result})


@user_bp.route("/self", methods=["GET"])
def get_self_user_info():
    jwt: str = fetch_token(request.headers.get("Authorization"))
    jwt_payload: dict[str, Any] = decode_jwt(jwt)

    studentId: str = jwt_payload["studentId"]
    user: User | None = user_db.get_user(studentId)
    schedules: list[Schedule] = schedule_db.get_schedules_by_user(user)

    result = user.to_json()
    result |= {"schedules": [schedule.to_json() for schedule in schedules]}

    return make_response({"status": "OK", "data": result})


@user_bp.route("/", methods=["POST"])
def add_user():
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    user_id: str = payload["id"]
    user_info_model: dict[str, Any] = {
        "id": user_id,
        "name": payload["name"],
        "role": payload["role"],
        "email": payload["email"],
        "note": payload["note"],
        "blocked": False
    }
    user_info_model |= {"account": user_id}

    user_db.add_user(User(**user_info_model))
    return make_response({"status": "OK", "message": f"User {user_id} added."})


@user_bp.route("/<account>", methods=["PUT"])
def modify_user(account: str):
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    user: User | None = user_db.get_user(account)
    assert user is not None

    user_info_model: dict[str, Any] = {
        "id": user.id,
        "account": user.account,
        "name": payload["name"],
        "role": payload["role"],
        "email": payload["email"],
        "note": payload["note"],
        "blocked": False
    }

    user_db.set_user(account, User(**user_info_model))
    return make_response({"status": "OK", "message": f"User {account} set."})


@user_bp.route("/<account>/blocked", methods=["POST"])
def blocked_user(account: str):
    user: User | None = user_db.get_user(account)
    assert user is not None

    user_info_model: dict[str, Any] = {
        "id": user.id,
        "account": user.account,
        "name": user.name,
        "role": user.role,
        "email": user.email,
        "note": user.note,
        "blocked": True
    }

    user_db.set_user(account, User(**user_info_model))
    return make_response({"status": "OK", "message": f"User {account} blocked."})


@user_bp.route("/<account>/unblocked", methods=["POST"])
def unblocked_user(account: str):
    user: User | None = user_db.get_user(account)
    assert user is not None

    user_info_model: dict[str, Any] = {
        "id": user.id,
        "account": user.account,
        "name": user.name,
        "role": user.role,
        "email": user.email,
        "note": user.note,
        "blocked": True
    }

    user_db.set_user(account, User(**user_info_model))
    return make_response({"status": "OK", "message": f"User {account} unblocked."})


@user_bp.route("/", methods=["GET"])
def get_users():
    users: List[User] = user_db.get_users()
    # TODO: Batch query schedule for users.
    return make_response({"status": "OK", "data": [user.to_json() for user in users]})


@user_bp.route("/self/avatar", methods=["POST"])
def upload_self_avatar():
    jwt: str = fetch_token(request.headers.get("Authorization"))
    jwt_payload: dict[str, Any] = decode_jwt(jwt)
    content: bytes = request.data

    student_id: str = jwt_payload["studentId"]
    filename: str = sha256(student_id.encode()).hexdigest()

    real_storage: RealStorage = RealStorage(TunnelCode.AVATAR)
    real_storage.touch_file(filename, "png")

    # TODO: Trying to support more media types here.
    real_storage.write_file_bytes(filename, "png", content)
    return make_response({"status": "OK"}) 


@user_bp.route("/avatar/<avatar_id>", methods=["GET"])
def get_avatar_by_id(avatar_id: str):
    real_storage: RealStorage = RealStorage(TunnelCode.AVATAR)

    if not real_storage.check_exists(avatar_id, "png"):
        return make_single_message_response(HTTPStatus.FORBIDDEN, "Absent avatar.")
    
    avatar_content: bytes = real_storage.read_file_bytes(avatar_id, "png")
    response: Response = make_response(avatar_content)
    response.headers.set("Content-Type", "image/png")
    response.headers.set("Content-Description", "attachment", filename=f"{avatar_id}.png")
    return response