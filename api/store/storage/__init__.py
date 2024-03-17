import os
from pathlib import Path

from flask import current_app

from store.storage.tunnel_type import TunnelCode

def check_tmp_files_exists(filename: str, filetype: str, tunnel: TunnelCode):
    tmp_path = Path(current_app.config["TMP_PATH"])
    tmp_tunnel_path: Path = tmp_path / tunnel.value
    tmp_file_path: Path = tmp_tunnel_path / f"{filename}.{filetype}"
    return os.path.exists(tmp_file_path)
