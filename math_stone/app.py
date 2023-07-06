from flask import Flask, redirect, render_template, request, session, jsonify, url_for
from flask_session import Session
from helpers import login_required, error, validate_login, get_session_id
from database import Database
from werkzeug.security import check_password_hash, generate_password_hash


app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config['TEMPLATES_AUTO_RELOAD'] = True
Session(app)

# remember res.fetchone() https://docs.python.org/3/library/sqlite3.html


@app.route("/", )
def index():
    return render_template("/index.html")


@app.route('/home', methods=['POST', 'GET'])
@login_required
def home():
    """Sign in to be able to play"""
    # Post is for the login form
    # Get is for when you're in another page once you're logged in
    return render_template('home.html')
        
@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if not username:
        return error('Must enter username', 422)
    
    if not password:
        return error('Must enter password', 422)
    
    if validate_login(username, password) == True:
        session['user_id'] = get_session_id(username)
        return redirect(url_for('home'))

    return error("Invalid session id", 400)

@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect('/')

@app.route('/register', methods=['POST'])
def register():
    username = request.form.get('reg-username')
    password = request.form.get('reg-password')
    confirm = request.form.get('reg-confirm')
    
    if not username:
        return error('Must enter username', 422)
    
    if not password:
        return error('Must enter password', 422)
    
    if not confirm:
        return error('Must enter confirmation', 422)
    
    if password != confirm:
        return error('Password must match confirmation', 422)
    password_hash = generate_password_hash(password)

    with Database() as db:
        query = "INSERT INTO users (username, hash) VALUES (?, ?)"
        paramaters = (username, password_hash,)
        db.execute(query, paramaters)

    return redirect(url_for('home')) 
        

@app.route('/check_username_availability', methods=['POST'])
def check_username_availability():
    username = request.form.get('username')

    with Database() as db:
        query = 'SELECT DISTINCT username FROM users WHERE LOWER(username) = LOWER(?)'
        parameters = (username,)
        result = db.fetchone(query, parameters)
    
    if result is None:
        return jsonify({'available': True})
    return jsonify({'available': False})


@app.route('/check_valid_login', methods=['POST'])
def check_valid_login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    is_login_valid = validate_login(username, password)

    if is_login_valid == True:
        return jsonify({'valid': True})
    return jsonify({'valid': False})
    
        
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



