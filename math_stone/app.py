from flask import Flask, redirect, render_template, request, session, jsonify, url_for
from flask_session import Session
from helpers import login_required, error, validate_login, get_user_id, get_user_experience, generate_reward_experience, generate_user_level_info, record_game_results
from werkzeug.security import check_password_hash, generate_password_hash
from database import Database
from game import Game
import json


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


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    session.clear()
    return redirect(url_for('index'))


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

    if (result is not None):
        return jsonify(True)
    return jsonify(False)
    


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
    # TODO


@app.route('/stats', methods=['GET', 'POST'])
@login_required
def stats():
    pass
    # TODO


@app.route('/leaderboard', methods=['POST'])
@login_required
def leaderboard():
    user_id = session['user_id']

    leaderboards = [
    [{ 'id': 1, 'username': 'Stefan' }, { 'id': 2, 'username': 'Petia' }, { 'id': 3, 'username': 'Ivan' }, { 'id': 4, 'username': 'Maria' }, { 'id': 5, 'username': 'Nikolai' }, { 'id': 6, 'username': 'Anna' }, { 'id': 7, 'username': 'Elena' }, { 'id': 8, 'username': 'Silvia' }, { 'id': 9, 'username': 'Dimitar' }, { 'id': 10, 'username': 'Georgi' }],
    [{ 'id': 11, 'username': 'Dimitar' }, { 'id': 12, 'username': 'Silvia' }, { 'id': 13, 'username': 'Georgi' }, { 'id': 14, 'username': 'Anna' }, { 'id': 15, 'username': 'Petia' }, { 'id': 16, 'username': 'Ivan' }, { 'id': 17, 'username': 'Nikolai' }, { 'id': 18, 'username': 'Elena' }, { 'id': 19, 'username': 'Stefan' }, { 'id': 20, 'username': 'Maria' }],
    [{ 'id': 21, 'username': 'Elena' }, { 'id': 22, 'username': 'Stefan' }, { 'id': 23, 'username': 'Petia' }, { 'id': 24, 'username': 'Dimitar' }, { 'id': 25, 'username': 'Silvia' }, { 'id': 26, 'username': 'Nikolai' }, { 'id': 27, 'username': 'Ivan' }, { 'id': 28, 'username': 'Georgi' }, { 'id': 29, 'username': 'Anna' }, { 'id': 30, 'username': 'Maria' }],
    [{ 'id': 31, 'username': 'Maria' }, { 'id': 32, 'username': 'Ivan' }, { 'id': 33, 'username': 'Petia' }, { 'id': 34, 'username': 'Silvia' }, { 'id': 35, 'username': 'Stefan' }, { 'id': 36, 'username': 'Nikolai' }, { 'id': 37, 'username': 'Dimitar' }, { 'id': 38, 'username': 'Anna' }, { 'id': 39, 'username': 'Elena' }, { 'id': 40, 'username': 'Georgi' }],
    [{ 'id': 41, 'username': 'Georgi' }, { 'id': 42, 'username': 'Anna' }, { 'id': 43, 'username': 'Ivan' }, { 'id': 44, 'username': 'Dimitar' }, { 'id': 45, 'username': 'Silvia' }, { 'id': 46, 'username': 'Petia' }, { 'id': 47, 'username': 'Elena' }, { 'id': 48, 'username': 'Stefan' }, { 'id': 49, 'username': 'Nikolai' }, { 'id': 50, 'username': 'Maria' }],
    [{ 'id': 51, 'username': 'Petia' }, { 'id': 52, 'username': 'Georgi' }, { 'id': 53, 'username': 'Anna' }, { 'id': 54, 'username': 'Elena' }, { 'id': 55, 'username': 'Nikolai' }, { 'id': 56, 'username': 'Dimitar' }, { 'id': 57, 'username': 'Ivan' }, { 'id': 58, 'username': 'Silvia' }, { 'id': 59, 'username': 'Stefan' }, { 'id': 60, 'username': 'Maria' }]
]


    return render_template('leaderboard.html', leaderboards=leaderboards)


@app.route('/error_redirect', methods=['GET', 'POST'])
def error_redirect():
    if request.method == 'GET':
        return error('error_redirect', 'you shouldnt be seeing this')
    if request.method == 'POST':
        error_message = request.form.get('errorMessage')
        error_code = request.form.get('errorCode')

        return error(error_message, error_code)
    

@app.route('/get_user_levels', methods=['POST'])
def get_user_levels():
    user_id = session['user_id']
    experience = get_user_experience(user_id)

    level_info_list = generate_user_level_info(experience)

    return jsonify(level_info_list)


@app.route('/generate_questions', methods=['POST'])
@login_required
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
@login_required
def record_results():
    user_id = session['user_id']
    results = json.loads(request.form.get('results'))

    user_experience = get_user_experience(user_id)
    
    reward_experience = generate_reward_experience(results)

    record_game_results(results, reward_experience, user_id)

    updated_experience = [sum(i) for i in zip(user_experience, reward_experience)]

    with Database() as db:
        query = ("UPDATE levels SET addition = (?), subtraction = (?), multiplication = (?), "
                "division = (?), exponential = (?) WHERE user_id = (?)")
        parameters = (updated_experience[0], updated_experience[1], updated_experience[2], updated_experience[3], updated_experience[4], user_id, )
        db.execute(query, parameters)

    return jsonify({'successful': True})


@app.route('/get_last_games_played', methods=['POST'])
@login_required
def get_last_games_played():
    user_id = session['user_id']

    with Database() as db:
        query = ("SELECT game_mode, questions, correct, addition_exp, subtraction_exp, multiplication_exp, division_exp, "
                "exponential_exp, game_timer FROM games WHERE user_id = (?) ORDER BY game_id desc LIMIT 5;")
        
        parameters = (user_id, )
        
        db.execute(query, parameters)
        last_games = db.fetchall()

    return jsonify(last_games)
