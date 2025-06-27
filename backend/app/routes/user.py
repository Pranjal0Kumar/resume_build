from flask import Blueprint, request, jsonify
import jwt, datetime
from flask_mail import Message
from app.models.db_models import get_users_collection
from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app
from app import mail

auth_bp = Blueprint('auth', __name__)
@auth_bp.route('/register',methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    user = get_users_collection()

    if user.find_one({'email': email}):
        return jsonify({'message': 'Email already exists'}), 409
    
    hashed_password = generate_password_hash(password)
    user.insert_one({
        'username': username,
        'email': email,
        'password': hashed_password,
        'is_verified': False,
        'created_at': datetime.datetime.utcnow()
    })
    token = jwt.encode({'username': username}, current_app.config['SECRET_KEY'], algorithm="HS256")
    msg = Message('Verify your email', sender=current_app.config['MAIL_USERNAME'], recipients=[email])
    msg.body = f'Click to verify: https://resume-build-1.onrender.com/auth/verify/{token}'
    try:
        mail.send(msg)
        return jsonify({'message': 'email sent'}), 201
    except Exception as mail_err:
        print("EMAIL SEND ERROR:", mail_err)
        return jsonify({'message': 'Email sending failed'}), 500
    return jsonify({'message': 'User registered successfully'}), 201


@auth_bp.route('/verify/<token>')
def verify_email(token):
    try:
        decoded = jwt.decode(token , current_app.config['SECRET_KEY'], algorithms=['HS256'])
        username = decoded['username']
        users = get_users_collection()
        users.update_one({'username': username}, {'$set': {'is_verified': True}})
        return jsonify({'message': 'Email verified successfully'})
    except:
        return jsonify({'message': 'Invalid token'}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    user = get_users_collection().find_one({'username': username})

    if not user:
        return jsonify({'message': 'no user'}), 401
    if not check_password_hash(user['password'],password):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'user': user['username'],
        'exp':datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    },current_app.config['SECRET_KEY'], algorithm='HS256')


    return jsonify({'token':token})

@auth_bp.route('/protected',methods=['GET'])
def protected():
    token =  request.headers.get('Authorization')

    if not token or not token.startswith('Bearer '):
        return jsonify({'message': 'Missing or invalid token'}), 401
    token = token.split(' ')[1]

    try:
        decoded = jwt.decode(token, current_app.config['SECRET_KEY'],algorithms=['HS256'])
        return jsonify({'message': 'Protected route accessed successfully'})
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token Expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401
    