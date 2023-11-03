from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

# Initialize SQLAlchemy instance
db = SQLAlchemy()


class Users(db.Model, UserMixin):
    """
    The Users model represents a user in the system.
    It extends UserMixin to include methods required by Flask-Login.
    """

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f"User('{self.username}', lists: '{self.lists}')"

    def to_dict(self):
        """
        Convert user data to dictionary format.
        """
        return {
            "id": self.id,
            "username": self.username,
            "lists": [list.to_dict() for list in self.lists],
        }


class Lists(db.Model):
    """
    The Lists model represents a to-do list.
    Each list belongs to a user and can have many tasks.
    """

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    tasks = db.relationship("Tasks", backref="lists", lazy=True)
    order_index = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"List('{self.name}', order_idx '{self.order_index}', tasks: '{self.tasks}')"

    def to_dict(self):
        """
        Convert list data to dictionary format, including top-level tasks.
        """
        tasks = [task.to_dict() for task in self.tasks if task.parent_id is None]
        return {
            "id": self.id,
            "name": self.name,
            "tasks": tasks,
            "order_index": self.order_index,
        }


class Tasks(db.Model):
    """
    The Tasks model represents a task in a to-do list.
    Each task belongs to a list and can have sub-tasks.
    """

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey("lists.id"), nullable=False)
    task_depth = db.Column(db.Integer, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("tasks.id"))
    is_completed = db.Column(db.Boolean, nullable=False, default=False)
    subtasks = db.relationship(
        "Tasks",
        backref=db.backref("parent", remote_side=[id]),
        lazy=True,
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"Task('{self.name}, list_id: {self.list_id}, task_depth: {self.task_depth}, parent_id: {self.parent_id}, is_completed: {self.is_completed}, subtasks: {self.subtasks}')"

    def to_dict(self):
        """
        Convert task data to dictionary format, including sub-tasks.
        """
        return {
            "id": self.id,
            "name": self.name,
            "list_id": self.list_id,
            "subtasks": [subtask.to_dict() for subtask in self.subtasks],
            "task_depth": self.task_depth,
            "parent_id": self.parent_id,
            "is_completed": self.is_completed,
        }
