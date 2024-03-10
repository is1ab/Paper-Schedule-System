from typing import Any, Tuple, Generator
from uuid import uuid4

import firebase_admin
from firebase_admin import App, firestore, credentials
from google.cloud.firestore import Client, DocumentReference, DocumentSnapshot
from google.cloud.firestore_v1.types.write import WriteResult
from google.protobuf.timestamp_pb2 import Timestamp

cred = credentials.Certificate("firebase_credential.json")
app: App = firebase_admin.initialize_app(cred)
db: Client = firestore.client()


def fetch_user_from_firebase(user_id: str) -> dict[str, Any]:
    return fetch_data("User", user_id)


def fetch_users_from_firebase() -> list[dict[str, Any]]:
    return fetch_all_data("User")


def add_user_to_firebase(user_id: str, data: dict[str, Any]):
    add_data("User", data, user_id)


def set_user_to_firebase(user_id: str, data: dict[str, Any]):
    modify_data("User", user_id, data)


def fetch_schedule_from_firebase(schedule_id: str) -> dict[str, Any]:
    return fetch_data("Schedule", schedule_id)


def fetch_schedules_from_firebase() -> list[dict[str, Any]]:
    return fetch_all_data("Schedule")


def add_schedule_to_firebase(schedule: dict[str, Any]) -> str:
    return add_data("Schedule", schedule)


def remove_schedule_from_firebase(schedule_id: str) -> None:
    delete_data("Schedule", schedule_id)


def modified_schedule_to_firebase(schedule_id: str, data: dict[str, Any]):
    modify_data("Schedule", schedule_id, data)


def add_data(collection: str, data: dict[str, Any], key=str(uuid4())) -> str:
    result_tuple: Tuple[Timestamp, DocumentReference] = db.collection(collection).add(data, key)
    doc_ref: DocumentReference = result_tuple[1]

    return str(doc_ref.id)


def delete_data(collection: str, key: str) -> None:
    db.collection(collection).document(key).delete()


def modify_data(collection: str, key: str, data: dict[str, Any]):
    db.collection(collection).document(key).set(data)
    


def fetch_all_data(collection: str) -> list[dict[str, Any]]:
    docs: Generator[DocumentSnapshot, Any, None] = db.collection(collection).stream()
    result = []

    for doc in docs:
        result.append(doc.to_dict())
    
    return result
    

def fetch_data(collection: str, doc: str) -> dict[str, Any]:
    doc_ref: DocumentReference = db.collection(collection).document(doc)
    doc_data: DocumentSnapshot = doc_ref.get()

    if doc_data.exists:
        return doc_data.to_dict()
    else:
        return {}
    
