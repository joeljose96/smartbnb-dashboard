from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import requests
import gspread
from oauth2client.service_account import ServiceAccountCredentials

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

WEATHER_API_KEY="153c652ea24a44bb2f322cb53ada84e4"
# Routes
@app.route('/api/weather')
def get_weather():
    city = "Birmingham"
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
    response=requests.get(url)
    if response.status_code !=200:
        return jsonify({"error": "couldn't fetch the weather"}), 500
    data = response.json()
    weather = {
        "temp": round(data["main"]["temp"]),
        "condition": data["weather"][0]["main"],
        "icon": data["weather"][0]["icon"]
    }
    return jsonify(weather)

@app.route('/api/sheet')
def get_guest_info():
    try:
        scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name('YOUR_FILE.json', scope)
        client = gspread.authorize(creds)

        sheet = client.open("SmartBnB Dashboard").worksheet("GuestInfo")
        records = sheet.get_all_records()

        return jsonify(records)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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

