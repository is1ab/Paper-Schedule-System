from typing import Any

from flask import Blueprint, Response, make_response, request

from auth.ntut_auth_util import ntut_login
from auth.jwt_util import make_jwt

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/login", methods=["POST"])
def login_route() -> Response:
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    account: str = payload["account"]
    password: str = payload["password"]

    login_result: dict[str, str] = ntut_login(account, password)
    jwt: str = make_jwt(login_result["username"], login_result["studentId"])
    return make_response({"status": "OK", "token": jwt})