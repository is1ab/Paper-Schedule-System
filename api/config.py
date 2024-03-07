import os
from datetime import timedelta
from urllib.parse import quote

SECRET_KEY: bytes = os.urandom(24)