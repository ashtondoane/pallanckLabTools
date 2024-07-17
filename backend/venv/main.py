from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins="*")

@app.route("/predictLocations")
def users():
    return jsonify({
        "prediction": [{"x":1,"y":1},{"x":50,"y":1},{"x":300,"y":20}]
    })

if __name__ == "__main__":
    app.run(debug=True, port=8080)