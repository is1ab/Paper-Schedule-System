from typing import Any

from flask import Blueprint, request, make_response

import store.db.query.holiday as holiday_db
from store.db.model.holiday import Holiday
from route_util import audit_route


holiday_bp = Blueprint("holiday", __name__, url_prefix="/api/holiday")


@audit_route(holiday_bp, "/", methods=["POST"])
def add_holiday():
    payload: dict[str, Any] | None = request.get_json(silent=True)
    assert payload is not None

    date: str = payload["date"]
    name: str = payload["name"]

    holiday_db.add_holiday(Holiday(name, date))
    return make_response({"status": "OK"})


@audit_route(holiday_bp, "/", methods=["GET"])
def get_holidays():
    holidays: list[Holiday] = holiday_db.get_holidays()

    return make_response(
        {"status": "OK", "data": [holiday.to_json() for holiday in holidays]}
    )


@audit_route(holiday_bp, "/<date>/", methods=["DELETE"])
def delete_holiday(date: str):
    holiday_db.delete_holiday(date)

    return make_response({"status": "OK"})
