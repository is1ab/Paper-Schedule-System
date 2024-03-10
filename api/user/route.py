import re
from typing import Any

from flask import Blueprint, make_response, request
from firebase.firestore_util import fetch_user_from_firebase, fetch_users_from_firebase

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


@user_bp.route("/", methods=["GET"])
def get_users():
    data: dict[str, Any] = fetch_users_from_firebase()
    return make_response({"status": "OK", "data": data})