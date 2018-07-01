from flask import Flask, request, jsonify, abort

app = Flask(__name__)


@app.route("/login/", methods=["POST"])
def login():
    if (
        request.json["username"] == "demo"
        and request.json["password"] == "demo"
    ):
        # we'd probably have a separate /me to grab user details
        # for now just include with token
        return jsonify(
            {"token": "12345", "username": "demo", "email": "demo@gmail.com"}
        )
    abort(401)


@app.route("/api/secure/", methods=["GET"])
def secure():
    if request.headers.get("Authorization") == "Bearer 12345":
        return jsonify({"message": "this is fine"})
    abort(401)
