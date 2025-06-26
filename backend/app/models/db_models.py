# app/models.py
from flask_pymongo import PyMongo
mongo = PyMongo()

def get_users_collection():
    return mongo.db.users