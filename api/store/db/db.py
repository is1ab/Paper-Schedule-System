import psycopg
from contextlib import contextmanager


@contextmanager
def create_connect():
    try:
        connection = psycopg.connect("postgresql://is1ab_admin:is1ab%401321@localhost:5432/PPS", autocommit=True)
        yield connection
    finally:
        connection.close()

@contextmanager
def create_transection():
    with create_connect() as conn:
        try:
            transection = conn.transaction()
            yield transection
        finally:
            pass

@contextmanager
def create_cursor(*args, **kwarg):
    with create_connect() as conn:
        try:
            cursor = conn.cursor(*args, **kwarg)
            yield cursor
        finally:
            cursor.close()