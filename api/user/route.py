from typing import Any, List

from flask import Blueprint, make_response, request

import store.db.query.user as user_db
from auth.jwt_util import fetch_token, decode_jwt
from store.db.model.user import User

user_bp = Blueprint("user", __name__, url_prefix="/api/user")

@user_bp.route("/<id>/userInfo", methods=["GET"])
def get_user_info(id: str):
    user: User | None = user_db.get_user(id)
    assert user is not None
    return make_response({"status": "OK", "data": user.to_json()})


@user_bp.route("/userInfo", methods=["GET"])
def get_self_user_info():
    jwt: str = fetch_token(request.headers.get("Authorization"))
    jwt_payload: dict[str, Any] = decode_jwt(jwt)

    username: str = jwt_payload["username"]
    studentId: str = jwt_payload["studentId"]

    return make_response({"status": "OK", "data": {
        "username": username,
        "studentId": studentId
    }})


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
    return make_response({"status": "OK", "data": [user.to_json() for user in users]})