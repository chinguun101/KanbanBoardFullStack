from flask import jsonify, request, Blueprint
from models import Tasks, db
from flask_login import login_required, current_user

bp_task = Blueprint("task", __name__)


@login_required
@bp_task.route("/add_task", methods=["POST"])
def add_task():
    try:
        task_data = request.get_json()
        new_task = Tasks(
            name=task_data["name"],
            list_id=task_data["id"],
            task_depth=0,
            parent_id=None,
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Successfully added task to the database."}), 200
    except Exception as e:
        return (
            jsonify({"message": f"Failed to add task to the database. error is {e}"}),
            400,
        )


@login_required
@bp_task.route("/tasks/<task_id>/update", methods=["PATCH"])
def update_task(task_id):
    try:
        task_data = request.get_json()
        task = Tasks.query.get(task_id)
        task.name = task_data["name"]
        task.list_id = task_data["list_id"]
        task.parent_id = task_data["parent_id"]
        task.is_completed = task_data["is_completed"]

        db.session.commit()
        return (
            jsonify(
                {
                    "message": f"Successfully updated task with id {task_id} in the database."
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "message": f"Failed to update task with id {task_id} in the database. error is {e}"
                }
            ),
            400,
        )


@login_required
@bp_task.route("/tasks/<task_id>/delete", methods=["DELETE"])
def delete_task(task_id):
    try:
        task = Tasks.query.get(task_id)
        db.session.delete(task)
        db.session.commit()
        return (
            jsonify(
                {
                    "message": f"Successfully deleted task with id {task_id} from the database."
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "message": f"Failed to delete task with id {task_id} from the database. error is {e}"
                }
            ),
            400,
        )


@bp_task.route("/tasks/<task_id>/add_subtask", methods=["POST"])
def add_subtask_to_task(task_id):
    try:
        task_data = request.get_json()
        new_task = Tasks(
            name=task_data["name"],
            list_id=task_data["list_id"],
            parent_id=task_id,
            task_depth=Tasks.query.get(task_id).task_depth + 1,
        )
        parent_task = Tasks.query.get(task_id)
        if parent_task.is_completed:
            parent_task.is_completed = False

        db.session.add(new_task)
        db.session.commit()
        return (
            jsonify(
                {
                    "message": f"Successfully added subtask to task with id {task_id} in the database."
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "message": f"Failed to add subtask to task with id {task_id} in the database. error is {e}"
                }
            ),
            400,
        )


@login_required
@bp_task.route("/tasks/<task_id>/move", methods=["PATCH"])
def move_task(task_id):
    try:
        task = Tasks.query.get(task_id)
        post_data = request.get_json()
        list_id = post_data["list_id"]

        if task.list_id != list_id:
            task.list_id = list_id
            task.task_depth = 0
            task.parent_id = None
            db.session.commit()
            return (
                jsonify(
                    {
                        "message": f"Successfully moved task with id {task_id} in the database."
                    }
                ),
                200,
            )
        else:
            return jsonify({"message": "Task is already in this list."}), 200
    except Exception as e:
        return (
            jsonify(
                {
                    "message": f"Failed to move task with id {task_id} in the database. error is {e}"
                }
            ),
            400,
        )
