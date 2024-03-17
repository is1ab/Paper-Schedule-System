from typing import List

from flask import Blueprint, make_response

import store.db.query.role as role_db
from store.db.model.role import Role

setting_bp = Blueprint("setting", __name__, url_prefix="/api/setting")

@setting_bp.route("/role", methods=["GET"])
def get_role():
    roles: List[Role] = role_db.get_role()

    return make_response({
        "status": "OK", 
        "data": [role.to_json() for role in roles]
    })