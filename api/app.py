import os
from flask import Flask
from pathlib import Path
from psycopg_pool import ConnectionPool
from typing import Any, Mapping

from audit.route import audit_bp
from auth.route import auth_bp
from host.route import host_bp
from schedule.route import schedule_bp
from schedule.admin_route import schedule_admin_bp
from setting.route import setting_bp
from store.storage.tunnel_type import TunnelCode
from user.route import user_bp


def create_app(test_config: Mapping[str, Any] | None = None) -> Flask:
    app = Flask(__name__)

    if test_config is None:
        app.config.from_pyfile("config.py")
    else:
        app.config.from_mapping(test_config)

    db_host = os.environ.get("PSS_DB_HOST", "localhost")
    db_port = os.environ.get("PSS_DB_PORT", "5432")
    db_user = os.environ.get("PSS_DB_USER", "is1ab_admin")
    db_password = os.environ.get("PSS_DB_PASSWORD", "is1ab@1321")

    app.config["ConnectionPool"] = ConnectionPool(
        f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/PSS",
        timeout=10,
        min_size=10,
    )

    app.register_blueprint(audit_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(schedule_admin_bp)
    app.register_blueprint(schedule_bp)
    app.register_blueprint(setting_bp)
    app.register_blueprint(host_bp)

    tmp_path = Path(app.config["TMP_STORAGE_PATH"])
    tmp_attachment_path = Path(tmp_path) / TunnelCode.ATTACHMENT.value
    os.makedirs(tmp_path, exist_ok=True)
    os.makedirs(tmp_attachment_path, exist_ok=True)

    return app
