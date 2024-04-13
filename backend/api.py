from flask import Flask, jsonify, request
from flask_pymongo import PyMongo, MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 
app.config["MONGO_URI"] = "mongodb://root:root@localhost:27017/test"

mongo = PyMongo(app)

tasks = {
    "todo": ['Create Home Page', 'Homepage integration with backend', 'Database integration'],
    "doing": ['Launch screen customisation', 'Tasks API'], 
    "done": ['Update Tasks API', 'Mongodb Initial Data'],
    "dropped": ['Useless task']
}

if mongo.db.test.count_documents({}) == 0:
    print('Inserting data into the database!')
    mongo.db.test.insert_one(tasks)
else:
    print('Data already exists in the database! Skipping insertion.')

@app.route('/')
def hello():
    return 'Hello from api!'

@app.route('/get_tasks', methods=['GET'])
def get_todo():
    todos = mongo.db.test.find({}, {"_id": 0})
    result = []
    for todo in todos:
        result.append(todo)
    return jsonify(result)

@app.route('/update_tasks', methods=['POST'])
def update_tasks():
    try:
        data = request.get_json()
        mongo.db.test.delete_many({})
        mongo.db.test.insert_one(data)
        return {200: 'Success'}
    except Exception as e:
        return {500: str(e)}


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
    
    
    
    
