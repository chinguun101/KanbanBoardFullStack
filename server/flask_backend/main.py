from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from models import db, Users
from blueprints.tasks import bp_task
from blueprints.lists import bp_list
from blueprints.auth import bp_auth

login_manager = LoginManager()


def create_app():
    app = Flask(__name__)
    app.config.update(
        SQLALCHEMY_DATABASE_URI="sqlite:///database.db",
        SECRET_KEY="todos",
    )

    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    app.register_blueprint(bp_task)
    app.register_blueprint(bp_list)
    app.register_blueprint(bp_auth)

    db.init_app(app)
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return db.session.get(Users, id)

    with app.app_context():
        db.create_all()

    @app.route("/")
    def index():
        return "<p>Backend is working! </p>"

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(port=5001, debug=True)
