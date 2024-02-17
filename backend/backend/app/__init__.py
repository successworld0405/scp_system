from flask import Flask, request, jsonify, session
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv

# test api
from routes import bp

# real api

app = Flask(__name__)
app.config['MAIN_URL'] = 'http://localhost:3000/'
# app.config['MAIN_URL'] = 'http://pationonline.ir/'
CORS(app, resources={r"/*": {"origins": app.config['MAIN_URL']}})
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000/"}})
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True

app.config['MONGO_URI'] = 'mongodb://root:H4QpE7IY4Zqa5CjIksqzqSfS@localhost:27017/scrapping_sys'  # Replace with your MongoDB URI
mongo = PyMongo(app, uri='mongodb://localhost:27017/scp_system')
bcrypt = Bcrypt(app)

# app.register_blueprint(bp, url_prefix="/api")
import controllers


# def create_app(test_config=None):
    # app = Flask(__name__)
    # CORS(app)

    # load_dotenv()
    # CONFIG = {

    # }

    # CONFIG |= {} if test_config is None else test_config

    # app.config.from_mapping(**CONFIG)

    # app.register_blueprint(bp, url_prefix="/api")


    # return app