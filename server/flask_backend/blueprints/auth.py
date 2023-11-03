from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from models import Users, db
import logging

bp_auth = Blueprint("auth", __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)


@bp_auth.route("/register", methods=["POST"])
def register():
    """Registers a new user with the provided username, email, and password."""
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"message": "Invalid input!"}), 400

    if Users.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists!"}), 400

    if Users.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists!"}), 400

    password_hash = generate_password_hash(password)
    new_user = Users(username=username, email=email, password_hash=password_hash)

    db.session.add(new_user)
    db.session.commit()
    logging.info(f"New user created: {new_user.username}")
    return jsonify({"message": "New user created!"}), 201


@bp_auth.route("/login", methods=["POST"])
def login():
    """Logs in a user with the provided login credentials."""
    data = request.get_json()
    login = data.get("login")  # can be either username or email
    password = data.get("password")

    if not login or not password:
        return jsonify({"message": "Invalid input!"}), 400

    user = (
        Users.query.filter_by(username=login).first()
        or Users.query.filter_by(email=login).first()
    )

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Username or password is incorrect!"}), 400

    login_user(user)
    logging.info(f"User {user.username} logged in successfully! Session id: {user.id}")
    return (
        jsonify({"message": "Logged in successfully!", "username": user.username}),
        200,
    )


@bp_auth.route("/logout", methods=["POST"])
@login_required
def logout():
    """Logs out the current user."""
    logout_user()
    logging.info(f"User {current_user.username} logged out successfully!")
    return jsonify({"message": "Logged out successfully!"}), 200
