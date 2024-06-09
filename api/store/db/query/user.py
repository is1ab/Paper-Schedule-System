import hashlib
from typing import Any, List

from psycopg import Connection
from psycopg.rows import dict_row

import store.db.query.role as role_db
from store.db.db import create_cursor
from store.db.model.user import User
from store.db.model.role import Role
from store.db.model.user_role import UserRole

def get_user(account: str) -> User | None:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select u.id, u."name", u.email, u.note, u."blocked", u.account, u.password
            from "user" u 
            where u.account = %s;            
        """
        cursor.execute(sql, (account,))
        result: dict[str, Any] = cursor.fetchone()
        roles: list[Role] = role_db.get_roles()
        user_roles: list[UserRole] = get_user_roles(account)

        if result == None:
            return None
        
        cursor.close()
        return User(
            result["id"],
            result["account"],
            result["email"],
            result["name"],
            result["note"],
            result["password"],
            result["blocked"],
            [role for role in [list(filter(lambda role: user_role.roleId == role.id, roles))[0] for user_role in user_roles]]
        )
    

def get_user_roles(account: str) -> list[UserRole]:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            SELECT account, "roleId" 
            FROM public.user_role
            WHERE "account" = %s
            ORDER BY "roleId" asc;
        """
        cursor.execute(sql, (account, ))
        results: list[dict[str, Any]] = cursor.fetchall()

        return [
            UserRole(
                account=result["account"],
                roleId=result["roleId"]
            ) for result in results
        ]


def get_users() -> List[User]:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select u.id, u."name", u.email, u.note, u."blocked", u.account, u.password
            from "user" u 
        """
        cursor.execute(sql)
        results: List[dict[str, Any]] = cursor.fetchall()
        cursor.close()
        
        roles: list[Role] = role_db.get_roles()
        users: list[User] = []

        for result in results:
            user_account: str = result["account"]
            user_roles: list[UserRole] = get_user_roles(user_account)

            users.append(
                User(
                    result["id"],
                    result["account"],
                    result["email"],
                    result["name"],
                    result["note"],
                    result["password"],
                    result["blocked"],
                    [role for role in [list(filter(lambda role: user_role.roleId == role.id, roles))[0] for user_role in user_roles]]
                )
            )

        return users


def add_user_without_commit(user: User, connection: Connection) -> None:
    try:
        with connection.cursor() as cursor:
            sql: str = """
                INSERT INTO public."user"
                ("name", email, note, "blocked", account, "password")
                VALUES(%s, %s, %s, %s, %s, %s);            
                """
            cursor.execute(
                sql,
                (
                    user.name,
                    user.email,
                    user.note,
                    user.blocked,
                    user.account,
                    None
                ),
            )
    except Exception as e:
        connection.rollback()
        raise e


def set_user_without_commit(account: str, user: User, connection: Connection) -> None:
    try:
        with connection.cursor() as cursor:
            sql: str = """
                UPDATE public."user"
                SET "name"=%s, email=%s, note=%s, "blocked"=%s
                WHERE account=%s;            
                """
            cursor.execute(
                sql,
                (user.name, user.email, user.note, user.blocked, account),
            )
    except Exception as e:
        connection.rollback()
        raise e


def update_password_without_commit(account: str, password: str, connection: Connection) -> None:
    try:
        password_sha256 = hashlib.sha256(password.encode()).hexdigest()
        with connection.cursor() as cursor:
            sql: str = """
                UPDATE public."user"
                SET "password"=%s
                WHERE account=%s;
            """
            cursor.execute(
                sql,
                (password_sha256, account)
            )
    except Exception as e:
        connection.rollback()
        raise e
    
def update_roles_without_commit(account: str, role_ids: list[int], connection: Connection):
    try:
        delete_roles_for_user_without_commit(account, connection)
        for role_id in role_ids:
            add_roles_for_user(account, role_id, connection)
    except Exception as e:
        connection.rollback()
        raise e


def add_roles_for_user(account: str, role_id: int, connection: Connection):
    try:
        with connection.cursor() as cursor:
            sql: str = """
                INSERT INTO public.user_role
                (account, "roleId")
                VALUES(%s, %s);
            """
            cursor.execute(sql, (account, role_id))
    except Exception as e:
        connection.rollback()
        raise e


def delete_roles_for_user_without_commit(account: str, connection: Connection):
    try:
        with connection.cursor() as cursor:
            sql: str = """
                DELETE FROM public.user_role
                WHERE account=%s
            """
            cursor.execute(sql, (account, ))
    except Exception as e:
        connection.rollback()
        raise e