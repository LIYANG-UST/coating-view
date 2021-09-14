from flask import Flask, request
from flask_cors import CORS, cross_origin
import requests
import json

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# API URL
clientId = "09532fd2fed5489696eca79b64e2caca"
w_api_url = "https://api.seniverse.com/v3/weather/now.json"
d_api_url = "http://www.1weilian.com:8750/mtInterface"
# API_KEY
api_key = "S7Q1HfGchFIi1O2WX"
# default location
location = "xianggang"
# default language
language = "en"

# http://127.0.0.0.1:5000/api


@app.route('/api/weather')
def weather_api():
    goal_url = "{}?key={}&location={}&language={}".format(w_api_url, api_key, location, language)
    print(goal_url)
    r = requests.get(goal_url)
    return r.text


info1 = json.dumps({"clientId": clientId, "page": 0, "rows": 10})
headers1 = {"content-type": "application/json;charset=UTF-8"}


@app.route('/api/recentdata')
def recent_data():
    goal_url = "{}/realTime/getRealTimeCurve".format(d_api_url)
    print(goal_url)
    r = requests.post(goal_url, data=info1, headers=headers1)
    r.encoding = 'utf-8'
    # print(r.text)
    return r.text


@app.route('/api/device/getDevices')
def device_info():
    goal_url = "{}/device/getDevices".format(d_api_url)
    print("goal_url: ", goal_url)
    r = requests.post(goal_url, data=info1, headers=headers1)
    # print(r.text)
    return r.text


@app.route('/api/historydata')
def history_data():
    sn = request.args.get("sn")
    start_time = request.args.get("startTime")
    end_time = request.args.get("endTime")
    goal_url = "{}/history/historyCurveData".format(d_api_url)
    print("goal_url: ", goal_url)
    info2 = {"sn": sn,
             "clientId": clientId,
             "startTime": start_time,
             "endTime": end_time}
    print(info2)
    r = requests.post(goal_url, data=json.dumps(info2), headers=headers1)
    print(r.text)
    return r.text


if __name__ == '__main__':
    app.run(debug=True)