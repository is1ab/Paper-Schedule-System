from psycopg import Connection
from psycopg_pool import ConnectionPool
from contextlib import contextmanager
from flask import current_app

@contextmanager
def create_transection():
    pool: ConnectionPool = current_app.config["ConnectionPool"]
    with pool.connection() as connection:
        try:
            transection = connection.transaction()
            yield connection, transection
        finally:
            pass

@contextmanager
def create_cursor(*args, **kwarg):
    pool: ConnectionPool = current_app.config["ConnectionPool"]
    with pool.connection() as conn:
        try:
            cursor = conn.cursor(*args, **kwarg)
            yield cursor
        finally:
            cursor.close()