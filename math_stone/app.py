from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
import sqlite3

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
    if request.method == "GET":
        print("register app route using get")
        return render_template("/register.html")
    
    elif request.method == "POST":
        if not request.form['reg_username']:
            return error("Must include a username", 403)
        username = request.form["reg_username"]
        
        if not request.form['reg_password']:
            return error("Must include a password", 403)
        password = request.form["reg_password"]        
        
        if not request.form['reg_confirmation']:
            return error("Must confirm password", 403)
        confirmation = request.form["reg_confirmation"]

        if password != confirmation:
            return error("Password and confirmation must match", 403)

        print(username, password, confirmation)


        return render_template("/play.html")




@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    pass


@app.route('/stats', methods=['GET', 'POST'])
@login_required
def stats():
    pass

