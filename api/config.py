import os
from datetime import timedelta
from urllib.parse import quote

SECRET_KEY: bytes = os.urandom(24)
TMP_STORAGE_PATH: str = "/tmp/pss/"
REAL_STORAGE_PATH: str = "./storage/"