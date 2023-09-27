from flask import Flask, redirect, render_template, request, session, jsonify, url_for
from flask_session import Session
from helpers import login_required, error, validate_login, get_user_id, get_user_experience, generate_reward_experience
from werkzeug.security import check_password_hash, generate_password_hash
from database import Database
from game import Game


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
        session['user_id'] = get_user_id(username)
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

        user_id = db.last_insert_rowid()[0][0];

        query2 = "INSERT INTO levels (user_id) VALUES (?)"
        paramaters2 = ((user_id),)
        db.execute(query2, paramaters2)

    session['user_id'] = get_user_id(username)
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


@app.route('/generate_questions', methods=['POST'])
def generate_questions():
    user_id = session['user_id']
    types = request.form.get('types')
    amount = request.form.get('amount')
    experience = get_user_experience(user_id)

    game = Game(types, amount, experience)
    questions = game.generate_questions()

    return jsonify(questions)


# Gets called when a game completes successfully. Records results - Updates experience
@app.route('/record_results', methods=['POST'])
def record_results():
    user_id = session['user_id']
    results = request.form.get('results')

    user_experience = get_user_experience(user_id)
    reward_experience = generate_reward_experience(results)

    updated_experience = [sum(i) for i in zip(user_experience, reward_experience)]

    with Database() as db:
        query = 'UPDATE levels SET addition = (?), subtraction = (?), multiplication = (?), division = (?), exponential = (?) WHERE user_id = (?)'
        parameters = (updated_experience[0], updated_experience[1], updated_experience[2], updated_experience[3], updated_experience[4], user_id, )
        db.execute(query, parameters)

    return jsonify({'reward_experience': reward_experience, 'updated_experience': updated_experience})
