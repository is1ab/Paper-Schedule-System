import os
from flask import Flask
from typing import Any, Mapping

from auth.route import auth_bp
from schedule.route import schedule_bp
from setting.route import setting_bp
from user.route import user_bp

def create_app(test_config: Mapping[str, Any] | None = None) -> Flask:
    app = Flask(__name__)

    if test_config is None:
        app.config.from_pyfile("config.py")
    else:
        app.config.from_mapping(test_config)

    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(schedule_bp)
    app.register_blueprint(setting_bp)

    os.mkdir("/tmp/pss")
    os.mkdir("/tmp/pss/attachment")

    return app