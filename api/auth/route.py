import hashlib
from http import HTTPStatus
from typing import Any
from flask import Blueprint, Response, make_response, request

import store.db.query.user as user_db
from auth.jwt_util import decode_jwt, fetch_token, make_jwt
from auth.ntut_auth_util import ntut_login
from auth.validator import (
    validate_user_id_should_be_able_to_access_or_return_http_status_code_401,
)
from route_util import audit_route
from store.db.db import create_transection
from store.db.model.user import User
from store.db.model.user_role import UserRole
from util import make_single_message_response

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
        return _ntut_login(account, password, user)
    else:
        return _password_login(account, password, user)
            

@audit_route(auth_bp, "/update_password", methods=["POST"])
def update_password_route() -> Response:
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    jwt: str = fetch_token(request.headers.get("Authorization"))
    jwt_payload: dict[str, Any] = decode_jwt(jwt)
    assert jwt_payload is not None

    account: str = jwt_payload["studentId"]
    password: str = payload["password"]

    with create_transection() as (connection, _) :
        user_db.update_password_without_commit(account, password, connection)
    
    return make_response({"status": "OK"})


def _ntut_login(account: str, password: str, user: User):
    login_result: dict[str, str] = ntut_login(account, password)
    jwt: str = make_jwt(login_result["username"], login_result["studentId"], user.role)
    return make_response({"status": "OK", "token": jwt})


def _password_login(account: str, password: str, user: User):
    if user is None:
        return make_single_message_response(HTTPStatus.FORBIDDEN, "User is not allow to login the system.")

    if hashlib.sha256(password.encode()).hexdigest() != user.password:
        return make_single_message_response(HTTPStatus.FORBIDDEN, "Incorrect password.")

    jwt: str = make_jwt(user.name, account, user)
    return make_response({"status": "OK", "token": jwt})