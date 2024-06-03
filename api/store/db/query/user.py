from typing import Any, List

from psycopg.rows import dict_row

from store.db.db import create_cursor
from store.db.model.role import Role
from store.db.model.user import User


def get_user(account: str) -> User | None:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select u.id, u."name", u.email, u.note, u."blocked", r.id as "roleId", r.name as "roleName", u.account, u.password
            from "user" u 
            join "role" r on r.id = u."role"
            where u.account = %s;            
        """
        cursor.execute(sql, (account,))
        result: dict[str, Any] = cursor.fetchone()

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
            Role(result["roleId"], result["roleName"]),
        )


def get_users() -> List[User]:
    with create_cursor(row_factory=dict_row) as cursor:
        sql: str = """
            select u.id, u."name", u.email, u.note, u."blocked", r.id as "roleId", r.name as "roleName", u.account, u.password
            from "user" u 
            join "role" r on r.id = u."role";       
        """
        cursor.execute(sql)
        results: List[dict[str, Any]] = cursor.fetchall()
        cursor.close()
        return [
            User(
                result["id"],
                result["account"],
                result["email"],
                result["name"],
                result["note"],
                result["password"],
                result["blocked"],
                Role(result["roleId"], result["roleName"]),
            )
            for result in results
        ]


def add_user(user: User) -> None:
    try:
        with create_cursor() as cursor:
            sql: str = """
                INSERT INTO public."user"
                ("name", email, note, "blocked", "role", account)
                VALUES(%s, %s, %s, %s, %s, %s);            
                """
            cursor.execute(
                sql,
                (
                    user.name,
                    user.email,
                    user.note,
                    user.blocked,
                    user.role,
                    user.account,
                ),
            )
            cursor.connection.commit()
            cursor.close()
    except Exception as e:
        cursor.connection.rollback()
        raise e


def set_user(account: str, user: User) -> None:
    try:
        with create_cursor() as cursor:
            sql: str = """
                UPDATE public."user"
                SET "name"=%s, email=%s, note=%s, "blocked"=%s, "role"=%s
                WHERE account=%s;            
                """
            cursor.execute(
                sql,
                (user.name, user.email, user.note, user.blocked, user.role, account),
            )
            cursor.connection.commit()
            cursor.close()
    except Exception as e:
        cursor.connection.rollback()
        raise e
