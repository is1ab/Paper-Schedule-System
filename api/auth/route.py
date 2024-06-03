import hashlib
from typing import Any

from flask import Blueprint, Response, make_response, request

import store.db.query.user as user_db
from auth.jwt_util import make_jwt
from auth.ntut_auth_util import ntut_login
from auth.validator import (
    validate_user_id_should_be_able_to_access_or_return_http_status_code_401,
)
from route_util import audit_route
from store.db.model.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@audit_route(auth_bp, "/login", methods=["POST"])
@validate_user_id_should_be_able_to_access_or_return_http_status_code_401
def login_route() -> Response:
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    account: str = payload["account"]
    password: str = payload["password"]

    user: User = user_db.get_user(account)

    if user.password is None:
        return _ntut_login(account, password)
    else:
        return _password_login(account, password, user)
            

def _ntut_login(account, password):
    login_result: dict[str, str] = ntut_login(account, password)
    jwt: str = make_jwt(login_result["username"], login_result["studentId"])
    return make_response({"status": "OK", "token": jwt})


def _password_login(account: str, password: str, user: User):
    if user is None:
        return make_response({"status": "Failed", "message": "User is not allow to login the system."})

    if hashlib.sha256(password.encode()).hexdigest() != user.password:
        return make_response({"status": "Failed", "message": "Incorrect password."})

    jwt: str = make_jwt(user.name, account)
    return make_response({"status": "OK", "token": jwt})