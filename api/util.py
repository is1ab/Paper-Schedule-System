from http import HTTPStatus

from flask import Response, make_response

from dataclasses import dataclass


def make_single_message_response(
    status_code: HTTPStatus, message: str = None
) -> Response:
    status = SingleMessageStatus(status_code, message)
    return make_response(status.message, status.code)


@dataclass
class SingleMessageStatus:
    """A convenient response status dataclass.

    The message can be directly passed for responses with mimetype in json.

    Attributes:
        code: HTTP status code.
        message: A dict with a single key "message".
    """

    code: int
    message: dict[str, str]

    def __init__(self, code: int, message: str | None = None) -> None:
        """
        Args:
            code:
                HTTP status code.
            message:
                The response message to be wrapped into the message dict.
                Default to "OK" if code is lower than 400, otherwise, an empty message.
        """
        self.code: int = code
        if message is None:
            message = "OK" if code < 400 else ""
        self.message = {"message": message}