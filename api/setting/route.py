from typing import List

from flask import Blueprint, make_response

import store.db.query.system_argument as system_argument_db
import store.db.query.role as role_db
import store.db.query.announcement as announcement_db
from store.db.model.announcement import Announcement
from store.db.model.role import Role
from store.db.model.system_argument import SystemArg

setting_bp = Blueprint("setting", __name__, url_prefix="/api/setting")


@setting_bp.route("/role", methods=["GET"])
def get_role():
    roles: List[Role] = role_db.get_roles()

    return make_response({"status": "OK", "data": [role.to_json() for role in roles]})


@setting_bp.route("/announcement", methods=["GET"])
def get_announcements():
    announcements: list[Announcement] = announcement_db.get_announcements()

    return make_response({"status": "OK", "data": [announcement.to_json() for announcement in announcements]})


@setting_bp.route("/system_arg", methods=["GET"])
def get_system_argument():
    system_arguments: list[SystemArg] = system_argument_db.get_system_arguments()

    return make_response({"status": "OK", "data": [system_argument.to_json() for system_argument in system_arguments]})