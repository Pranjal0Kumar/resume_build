from flask import Flask
import os
from flask_cors import CORS
from app.config import Config
from .models.db_models import mongo

from flask_mail import Mail


mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    mongo.init_app(app)
    CORS(app)
    mail.init_app(app)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    from .routes.api import api_bp
    app.register_blueprint(api_bp,url_prefix='/api')

    from app.routes.user import auth_bp
    app.register_blueprint(auth_bp , url_prefix='/auth')
    return app
