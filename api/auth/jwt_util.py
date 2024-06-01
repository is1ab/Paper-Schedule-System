import jwt
import re

from typing import Any, Final
from datetime import datetime, timedelta, timezone


class HS256JWTCodec:
    def __init__(self, key: str) -> None:
        self._key: Final[str] = key
        self._algorithm: Final[str] = "HS256"

    @property
    def key(self) -> str:
        return self._key

    @property
    def algorithm(self) -> str:
        return self._algorithm

    def encode(
        self,
        payload: dict[str, Any],
        expiration_time_delta: timedelta = timedelta(days=1),
    ) -> str:
        """Returns the JWT with `data`, Issue At (iat) and Expiration Time (exp) as payload."""
        current_time: datetime = datetime.now(tz=timezone.utc)
        expiration_time: datetime = current_time + expiration_time_delta
        payload = {
            "data": payload,
            "iat": current_time,
            "exp": expiration_time,
        }
        token: str = jwt.encode(payload, key=self._key, algorithm=self._algorithm)
        return token

    def decode(self, token: str) -> dict[str, Any]:
        data: dict[str, Any] = jwt.decode(
            token, key=self._key, algorithms=[self._algorithm]
        )
        return data

    def is_valid_jwt(self, token: str) -> bool:
        """Returns False if the expiration time (exp) is in the past or it failed validation."""
        try:
            self.decode(token)
        except (jwt.exceptions.DecodeError, jwt.exceptions.ExpiredSignatureError):
            return False
        return True


def fetch_token(jwt: str | None):
    if jwt == None:
        return ""

    pattern: re.Pattern = re.compile("Bearer (.+)")
    groups = re.findall(pattern, jwt)

    if len(groups) == 0:
        return ""
    else:
        return groups[0]


def make_jwt(username: str, student_id: str) -> str:
    codec = HS256JWTCodec("some_random_key")
    return codec.encode({"username": username, "studentId": student_id})


def decode_jwt(jwt: str) -> dict[str, Any]:
    codec = HS256JWTCodec("some_random_key")
    return codec.decode(jwt)["data"]

def is_jwt_valid(jwt: str) -> bool:
    codec = HS256JWTCodec("some_random_key")
    return codec.is_valid_jwt(jwt)