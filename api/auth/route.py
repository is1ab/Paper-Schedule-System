from typing import Any

from flask import Blueprint, Response, make_response, request

from auth.jwt_util import make_jwt
from auth.ntut_auth_util import ntut_login
from auth.validator import validate_user_id_should_be_able_to_access_or_return_http_status_code_401
from route_util import audit_route

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@audit_route(auth_bp, "/login", methods=["POST"])
@validate_user_id_should_be_able_to_access_or_return_http_status_code_401
def login_route() -> Response:
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    account: str = payload["account"]
    password: str = payload["password"]

    login_result: dict[str, str] = ntut_login(account, password)
    jwt: str = make_jwt(login_result["username"], login_result["studentId"])
    return make_response({"status": "OK", "token": jwt})