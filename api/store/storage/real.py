from flask import current_app

from store.storage.base import StorageBase
from store.storage.tunnel_type import TunnelCode

class RealStorage(StorageBase):
    def __init__(self, tunnel: TunnelCode):
        super().__init__(current_app.config["REAL_STORAGE_PATH"], tunnel)