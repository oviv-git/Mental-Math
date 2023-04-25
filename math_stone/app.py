from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
import sqlite3

from helpers import login_required

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config['TEMPLATES_AUTO_RELOAD'] = True
Session(app)

con = sqlite3.connect("math-stone.db")
db = con.cursor()

# remember res.fetchone() https://docs.python.org/3/library/sqlite3.html

@app.route("/")
def index():
    return render_template("/index.html")


@app.route('/play', methods=['GET', 'POST'])
@login_required
def play():
    pass


@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    pass


@app.route('/stats', methods=['GET', 'POST'])
@login_required
def stats():
    pass

