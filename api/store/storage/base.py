import os

from pathlib import Path

from store.storage.tunnel_type import TunnelCode


class StorageBase:
    def __init__(self, path: str, tunnel: TunnelCode):
        self.path = Path(path) / tunnel.value

        if not os.path.exists(self.path):
            os.makedirs(self.path)

    def remove_redundant_dot(self, file_type: str) -> str:
        if file_type[0] == ".":
            return file_type[1::]
        return file_type

    def check_exists(self, file_name: str, file_type: str):
        file_type = self.remove_redundant_dot(file_type)
        file_path = self.path / f"{file_name}.{file_type}"
        print(f"{file_name}.{file_type}")
        return os.path.exists(file_path)

    def touch_file(self, file_name: str, file_type: str):
        file_type = self.remove_redundant_dot(file_type)
        file_path = self.path / f"{file_name}.{file_type}"
        return file_path.touch()

    def read_file_bytes(self, file_name: str, file_type: str):
        file_type = self.remove_redundant_dot(file_type)
        file_path = self.path / f"{file_name}.{file_type}"

        with open(file_path, "rb") as file:
            return file.read()

    def write_file_bytes(self, file_name: str, file_type: str, data: bytes):
        file_type = self.remove_redundant_dot(file_type)
        file_path = self.path / f"{file_name}.{file_type}"

        with open(file_path, "wb") as file:
            file.write(data)
