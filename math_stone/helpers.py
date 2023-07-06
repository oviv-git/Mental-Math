from functools import wraps
from flask import session, render_template, redirect
from database import Database
from werkzeug.security import check_password_hash

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/index")
        return f(*args, **kwargs)
    return decorated_function


def get_session_id(username):
    with Database() as db:
        query = "SELECT DISTINCT id FROM users WHERE LOWER(username) = LOWER(?)"
        parameters = (username, )
        user_id = db.fetchone(query, parameters)

        return user_id[0]

def validate_login(username, password):
    with Database() as db:
        query = "SELECT DISTINCT hash FROM users WHERE LOWER(username) = LOWER(?)"
        paramaters = (username, )
        user_hash = db.fetchone(query, paramaters)

        is_login_valid = check_password_hash(user_hash[0], password)
        
        if is_login_valid == True:
            return True
        return False

def error(message, code=400):
    """Render message as an apology to user."""
    
    return render_template("error.html", code=code, message=message)

