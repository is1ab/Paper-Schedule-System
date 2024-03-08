from typing import Any

from flask import Blueprint, make_response
from firebase.firestore_util import fetch_user_from_firebase, fetch_users_from_firebase


user_bp = Blueprint("user", __name__, url_prefix="/api/user")

@user_bp.route("/<id>", methods=["GET"])
def get_user(id: str):
    data: dict[str, Any] = fetch_user_from_firebase(id)
    return make_response({"status": "OK", "data": data})


@user_bp.route("/", methods=["GET"])
def get_users():
    data: dict[str, Any] = fetch_users_from_firebase()
    return make_response({"status": "OK", "data": data})