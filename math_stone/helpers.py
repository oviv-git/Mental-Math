from functools import wraps
from flask import session, redirect, render_template

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/index")
        return f(*args, **kwargs)
    return decorated_function


def error(message, code=400):
    """Render message as an apology to user."""
    
    return render_template("error.html", code=code, message=message)

