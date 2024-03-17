from functools import wraps
from typing import Any, Callable, TypeVar
from http import HTTPStatus

from flask import Response, request

import store.db.query.user as user_db
from util import make_single_message_response
from store.db.model.user import User

T = TypeVar("T")


def validate_user_id_should_be_able_to_access_or_return_http_status_code_401(
    func: Callable[..., Response | T]
) -> Callable[..., Response | T]:
    @wraps(func)
    def wrapper(*args, **kwargs) -> Response | T:
        payload: dict[str, Any] | None = request.get_json(silent=True)
        assert payload is not None

        account: str = payload["username"]
        user: User | None = user_db.get_user(account)

        if user == None:
            return make_single_message_response(HTTPStatus.UNAUTHORIZED, "登入失敗，目前沒有權限登入這個系統")

        return func(*args, **kwargs)

    return wrapper