import re
from typing import Any

from flask import Blueprint, make_response, request
from firebase.firestore_util import add_user_to_firebase, fetch_user_from_firebase, fetch_users_from_firebase, set_user_to_firebase

from auth.jwt_util import fetch_token, decode_jwt

user_bp = Blueprint("user", __name__, url_prefix="/api/user")

@user_bp.route("/<id>/userInfo", methods=["GET"])
def get_user_info(id: str):
    data: dict[str, Any] = fetch_user_from_firebase(id)
    return make_response({"status": "OK", "data": data})


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

    add_user_to_firebase(user_id, user_info_model)
    return make_response({"status": "OK", "message": f"User {user_id} added."})


@user_bp.route("/<user_id>", methods=["PUT"])
def modify_user(user_id: str):
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    user_info_model: dict[str, Any] = {
        "id": user_id,
        "name": payload["name"],
        "role": payload["role"],
        "email": payload["email"],
        "note": payload["note"],
        "blocked": False
    }

    set_user_to_firebase(user_id, user_info_model)
    return make_response({"status": "OK", "message": f"User {user_id} set."})


@user_bp.route("/<user_id>/blocked", methods=["POST"])
def blocked_user(user_id: str):
    payload: dict[str, Any] = fetch_user_from_firebase(user_id)

    user_info_model: dict[str, Any] = {
        "id": user_id,
        "name": payload["name"],
        "role": payload["role"],
        "email": payload["email"],
        "note": payload["note"],
        "blocked": True
    }

    set_user_to_firebase(user_id, user_info_model)
    return make_response({"status": "OK", "message": f"User {user_id} blocked."})


@user_bp.route("/<user_id>/unblocked", methods=["POST"])
def unblocked_user(user_id: str):
    payload: dict[str, Any] = fetch_user_from_firebase(user_id)
    
    user_info_model: dict[str, Any] = {
        "id": user_id,
        "name": payload["name"],
        "role": payload["role"],
        "email": payload["email"],
        "note": payload["note"],
        "blocked": False
    }

    set_user_to_firebase(user_id, user_info_model)
    return make_response({"status": "OK", "message": f"User {user_id} unblocked."})


@user_bp.route("/", methods=["GET"])
def get_users():
    data: dict[str, Any] = fetch_users_from_firebase()
    return make_response({"status": "OK", "data": data})