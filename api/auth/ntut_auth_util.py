from typing import Any
from http import HTTPStatus
from functools import wraps

from flask import current_app, request, make_response
from requests import Response, post

from auth.jwt_util import HS256JWTCodec
from util import SingleMessageStatus


def ntut_login(student_id: str, password: str) -> bool:
    host: str = "https://app.ntut.edu.tw/"
    login_url: str = host + "login.do"

    data: dict[str, str] = {"muid": student_id, "mpassword": password, "forceMobile": "app", "md5Code": "1111", "ssoId": ""}
    header: dict[str, str] = {"User-Agent": "Direk Android App"}
    res: Response = post(login_url, data=data, headers=header)

    res_json: dict[str, Any] = res.json()

    return {
        "studentId": student_id,
        "username": res_json["givenName"]
    }


def verify_login_or_return_401(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        codec = HS256JWTCodec(current_app.config["jwt_key"])
        cookie: str | None = request.cookies.get("jwt")

        if cookie is None or not codec.is_valid_jwt(cookie):
            status = SingleMessageStatus(HTTPStatus.UNAUTHORIZED, "Unauthorized.")
            return make_response(status.message, status.code)

        return func(*args, **kwargs)

    return wrapper