from typing import Any, Generator

import firebase_admin
from firebase_admin import App, firestore, credentials
from google.cloud.firestore import Client, DocumentReference, DocumentSnapshot

cred = credentials.Certificate("firebase_credential.json")
app: App = firebase_admin.initialize_app(cred)
db: Client = firestore.client()


def fetch_user(user_id: str) -> dict[str, Any]:
    return fetch_data("User", user_id)


def fetch_users() -> list[dict[str, Any]]:
    return fetch_all_data("User")


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
    
