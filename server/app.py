from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'data.db')
db = SQLAlchemy(app)

# Models
class Metrics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bookings = db.Column(db.Integer)
    occupancy = db.Column(db.String(10))
    revenue = db.Column(db.String(20))

class AccessCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10))

# Routes
@app.route('/api/airbnb', methods=['GET'])
def get_airbnb():
    data = Metrics.query.first()
    if not data:
        return jsonify({"bookings": 0, "occupancy": "0%", "revenue": "$0"})
    return jsonify({
        "bookings": data.bookings,
        "occupancy": data.occupancy,
        "revenue": data.revenue
    })

@app.route('/api/airbnb', methods=['POST'])
def update_airbnb():
    data = request.json
    metrics = Metrics.query.first() or Metrics()
    metrics.bookings = data['bookings']
    metrics.occupancy = data['occupancy']
    metrics.revenue = data['revenue']
    db.session.add(metrics)
    db.session.commit()
    return jsonify({"message": "Updated successfully"})

@app.route('/api/access', methods=['POST'])
def check_code():
    code = request.json.get("code")
    if AccessCode.query.filter_by(code=code).first():
        return jsonify({"valid": True})
    return jsonify({"valid": False})


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if AccessCode.query.count() == 0:
            db.session.add(AccessCode(code=12344))
            db.session.commit()

    app.run(debug=True)

