import functools

from flask import Flask, request, jsonify, abort

app = Flask(__name__)


def auth_required(fn):

    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        if request.headers.get("Authorization") == "Bearer 12345":
            return fn(*args, **kwargs)
        else:
            abort(401)

    return wrapper


@app.route("/login/", methods=["POST"])
def login():
    if (
        request.json["username"] == "demo"
        and request.json["password"] == "demo"
    ):
        return jsonify({"token": "12345"})
    abort(401)


@app.route("/api/me/", methods=["GET"])
@auth_required
def user_details():
    return jsonify({"username": "demo", "email": "demo@gmail.com"})


@app.route("/api/secure/", methods=["GET"])
@auth_required
def secure():
    return jsonify({"message": "this is fine"})
