from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import uuid

app = Flask(__name__)
CORS(app)

# =========================
# FOLDER SETUP
# =========================
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

BASE_URL = "https://yr-printing-chatbot.onrender.com/uploads"


# =========================
# TEST ROUTE (CHECK SERVER)
# =========================
@app.route("/")
def home():
    return "✅ Flask Server is Working"


# =========================
# FILE UPLOAD ROUTE
# =========================
@app.route("/upload", methods=["POST"])
def upload_file():

    if "file" not in request.files:
        return jsonify({"error": "No file found"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty file"}), 400

    filename = str(uuid.uuid4()) + "_" + file.filename
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    file.save(filepath)

    file_url = f"{BASE_URL}/{filename}"

    return jsonify({
        "fileUrl": file_url,
        "fileName": file.filename
    })


# =========================
# SERVE UPLOADED FILES
# =========================
@app.route("/uploads/<filename>")
def get_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True)