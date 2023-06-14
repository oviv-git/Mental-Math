import sqlite3
from flask import Flask, flash, redirect, render_template, request, session, jsonify
from flask_session import Session

from helpers import login_required, error

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config['TEMPLATES_AUTO_RELOAD'] = True
Session(app)

con = sqlite3.connect("math-stone.db")
db = con.cursor()

# remember res.fetchone() https://docs.python.org/3/library/sqlite3.html

@app.route("/", )
def index():
    return render_template("/index.html")



@app.route('/play', methods=["POST"])
# @login_required
def play():
    """Sign in to be able to play"""
    # Post is for the login form
    # Get is for when you're in another page once you're logged in
    if request.method == "GET":
        print("play app route hit get")
        return render_template("/play.html")
    
    elif request.method == "POST":
        print("play app route hit post")
        return render_template("/play.html")
    

@app.route('/register', methods=['GET', 'POST'])
def register():
    pass
    # if request.method == "GET":
    #     print("register app route using get")
    #     return render_template("/register.html")
    
    # elif request.method == "POST":
    #     if not request.form['reg_username']:
    #         return jsonify({'status': 'invalid'})
        # username = request.form["reg_username"]
        
        # if not request.form['reg_password']:
        #     return response
        #     return error("Must include a password", 403)
        # password = request.form["reg_password"]        
        
        # if not request.form['reg_confirmation']:
        #     return response
        #     return error("Must confirm password", 403)
        # confirmation = request.form["reg_confirmation"]

        # if password != confirmation:
        #     return response
        #     return error("Password and confirmation must match", 403)

        # print(username, password, confirmation)

        
        # return render_template("/play.html")
@app.route('/check_username_availability', methods=['POST'])
def check_username_availability():
    if request.method == "POST":
        username = request.form.get('username')
        print("INSIDE OF USERNAME AVAIL: ", username)
        response = {'available': True}
        return jsonify(response)


@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    pass


@app.route('/stats', methods=['GET', 'POST'])
@login_required
def stats():
    pass

@app.route('/error_redirect', methods=['GET', 'POST'])
def error_redirect():
    if request.method == 'GET':
        return error('error_redirect', 'you shouldnt be seeing this')
    if request.method == 'POST':
        error_message = request.form.get('errorMessage')
        error_code = request.form.get('errorCode')

        return error(error_message, error_code)



