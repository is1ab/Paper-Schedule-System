from functools import wraps
from typing import Any, Callable, TypeVar
from http import HTTPStatus

from flask import Response, request

from firebase.firestore_util import fetch_user_from_firebase
from util import make_single_message_response

T = TypeVar("T")


def validate_user_id_should_be_able_to_access_or_return_http_status_code_401(
    func: Callable[..., Response | T]
) -> Callable[..., Response | T]:
    @wraps(func)
    def wrapper(*args, **kwargs) -> Response | T:
        payload: dict[str, Any] | None = request.get_json(silent=True)
        assert payload is not None

        account: str = payload["username"]
        data: dict[str, Any] = fetch_user_from_firebase(account)

        if data == {}:
            return make_single_message_response(HTTPStatus.UNAUTHORIZED, "登入失敗，請確認帳號與密碼")

        return func(*args, **kwargs)

    return wrapper