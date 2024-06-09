from hashlib import sha256
from http import HTTPStatus
from typing import Any, List
from mimetypes import guess_extension

from flask import Blueprint, Response, make_response, request
from magic import Magic

import store.db.query.user as user_db
import store.db.query.role as role_db
import store.db.query.schedule as schedule_db
from auth.jwt_util import fetch_token, decode_jwt
from schedule.route import generate_schedules
from route_util import audit_route
from store.db.db import create_transection
from store.db.model.schedule import Schedule
from store.db.model.role import Role
from store.db.model.user import User
from store.db.model.user_role import UserRole
from store.storage import TunnelCode
from store.storage.real import RealStorage
from util import make_single_message_response

user_bp = Blueprint("user", __name__, url_prefix="/api/user")


@audit_route(user_bp, "/<account>/", methods=["GET"])
def get_user(account: str):
    user: User | None = user_db.get_user(account)
    assert user is not None

    schedules: list[Schedule] = generate_schedules()
    user_schedules: list[Schedule] = filter(lambda schedule: schedule.user is not None and schedule.user.id == user.id, schedules)

    result = user.to_json()
    result |= {"schedules": [schedule.to_json() for schedule in user_schedules]}

    return make_response({"status": "OK", "data": result})


@audit_route(user_bp, "/self", methods=["GET"])
def get_self_user_info():
    jwt: str = fetch_token(request.headers.get("Authorization"))
    jwt_payload: dict[str, Any] = decode_jwt(jwt)

    studentId: str = jwt_payload["studentId"]
    user: User | None = user_db.get_user(studentId)
    
    schedules: list[Schedule] = generate_schedules()
    user_schedules: list[Schedule] = filter(lambda schedule: schedule.user.id == user.id, schedules)

    result = user.to_json()
    result |= {"schedules": [schedule.to_json() for schedule in user_schedules]}

    return make_response({"status": "OK", "data": result})


@audit_route(user_bp, "/", methods=["POST"])
def add_user():
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    user_id: str = payload["id"]
    user_info_model: dict[str, Any] = {
        "id": user_id,
        "name": payload["name"],
        "email": payload["email"],
        "note": payload["note"],
        "blocked": False,
        "password": None
    }
    user_info_model |= {"account": user_id}

    with create_transection() as (connection, transection):
        user_db.add_user_without_commit(User(**user_info_model), connection)
        user_db.update_roles_without_commit(user_id, [payload["role"]], connection)
    
    return make_response({"status": "OK", "message": f"User {user_id} added."})


@audit_route(user_bp, "/<account>", methods=["PUT"])
def modify_user(account: str):
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    user: User | None = user_db.get_user(account)
    assert user is not None

    user_info_model: dict[str, Any] = {
        "id": user.id,
        "account": user.account,
        "password": user.password,
        "name": payload["name"],
        "email": payload["email"],
        "note": payload["note"],
        "blocked": False,
    }

    with create_transection() as (connection, transection):
        user_db.set_user_without_commit(account, User(**user_info_model), connection)
        user_db.update_roles_without_commit(account, [payload["role"]], connection)
    
    return make_response({"status": "OK", "message": f"User {account} set."})


@audit_route(user_bp, "/<account>/blocked", methods=["POST"])
def blocked_user(account: str):
    user: User | None = user_db.get_user(account)
    assert user is not None

    user_info_model: dict[str, Any] = {
        "id": user.id,
        "account": user.account,
        "name": user.name,
        "roles": user.roles,
        "email": user.email,
        "note": user.note,
        "blocked": True,
    }

    user_db.set_user(account, User(**user_info_model))
    return make_response({"status": "OK", "message": f"User {account} blocked."})


@audit_route(user_bp, "/<account>/unblocked", methods=["POST"])
def unblocked_user(account: str):
    user: User | None = user_db.get_user(account)
    assert user is not None

    user_info_model: dict[str, Any] = {
        "id": user.id,
        "account": user.account,
        "name": user.name,
        "email": user.email,
        "note": user.note,
        "blocked": True,
    }

    with create_transection() as (connection, transection):
        user_db.set_user_without_commit(account, User(**user_info_model), connection)
        user_db.update_roles_without_commit(account, [role.id for role in user.roles], connection)
    
    return make_response({"status": "OK", "message": f"User {account} unblocked."})


@audit_route(user_bp, "/", methods=["GET"])
def get_users():
    users: List[User] = user_db.get_users()
    # TODO: Batch query schedule for users.
    return make_response({"status": "OK", "data": [user.to_json() for user in users]})


@audit_route(user_bp, "/self/avatar", methods=["GET"])
def get_self_avatar():
    jwt: str = fetch_token(request.headers.get("Authorization"))
    jwt_payload: dict[str, Any] = decode_jwt(jwt)

    student_id: str = jwt_payload["studentId"]
    return fetch_avatar(student_id)


@audit_route(user_bp, "/<account>/avatar", methods=["GET"])
def get_account_avatar(account: str):
    return fetch_avatar(account)


@audit_route(user_bp, "/self/avatar", methods=["POST"])
def upload_self_avatar():
    jwt: str = fetch_token(request.headers.get("Authorization"))
    jwt_payload: dict[str, Any] = decode_jwt(jwt)
    content: bytes = request.data

    mime: Magic = Magic(mime=True)
    mimeType = mime.from_buffer(content)
    if mimeType.split("/")[0] != "image":
        return make_single_message_response(HTTPStatus.FORBIDDEN, "Invalid Image file.")

    student_id: str = jwt_payload["studentId"]
    filename: str = sha256(student_id.encode()).hexdigest()

    real_storage: RealStorage = RealStorage(TunnelCode.AVATAR)
    real_storage.touch_file(filename, "avatar")

    real_storage.write_file_bytes(filename, "avatar", content)
    return make_response({"status": "OK"})


def fetch_avatar(account: str):
    filename: str = sha256(account.encode()).hexdigest()

    real_storage: RealStorage = RealStorage(TunnelCode.AVATAR)

    if not real_storage.check_exists(filename, "avatar"):
        return make_single_message_response(HTTPStatus.FORBIDDEN, "Absent avatar.")

    avatar_content: bytes = real_storage.read_file_bytes(filename, "avatar")
    mime: Magic = Magic(mime=True)
    mimeType = mime.from_buffer(avatar_content)
    extension = guess_extension(mimeType)

    response: Response = make_response(avatar_content)
    response.headers.set("Content-Type", mimeType)
    response.headers.set(
        "Content-Description", "attachment", filename=f"{account}{extension}"
    )
    return response
