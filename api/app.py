import os
from flask import Flask
from pathlib import Path
from psycopg_pool import ConnectionPool
from typing import Any, Mapping

from audit.route import audit_bp
from auth.route import auth_bp
from holiday.route import holiday_bp
from schedule.route import schedule_bp
from setting.route import setting_bp
from store.storage.tunnel_type import TunnelCode
from user.route import user_bp


def create_app(test_config: Mapping[str, Any] | None = None) -> Flask:
    app = Flask(__name__)

    if test_config is None:
        app.config.from_pyfile("config.py")
    else:
        app.config.from_mapping(test_config)
    
    app.config["ConnectionPool"] = ConnectionPool("postgresql://is1ab_admin:is1ab%401321@localhost:5432/PPS", timeout=10)

    app.register_blueprint(audit_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(holiday_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(schedule_bp)
    app.register_blueprint(setting_bp)

    tmp_path = Path(app.config["TMP_STORAGE_PATH"])
    tmp_attachment_path = Path(tmp_path) / TunnelCode.ATTACHMENT.value
    os.makedirs(tmp_path, exist_ok=True)
    os.makedirs(tmp_attachment_path, exist_ok=True)

    return app