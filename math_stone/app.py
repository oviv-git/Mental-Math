"""
    Route handler functions and some AJAX request functions that handle the backend of the webapp

    Functions
        index: The homepage where the user can either login or register
        home: Contains the main game and basic stats about the user
        profile: Displays more advanced stats about the user and contains a search function
        leaderboard: Displays the global leaderboards showing who has more experience
        game_history: Displays the users detailed game history with each and every question
        get_last_games_played: AJAX request to get basic information about the users last games
        register: Allows to user to register, checks for duplicate username and secures password
        login: Allows the user to login if they've already registered
        logout: Allows the user to logout, cleans all the session information.
        check_username_availability: Checks if the username is already registered, case insensitive.
        check_valid_login: Helper function for login that verifies the username and pass
        get_user_levels: AJAX request to get a list of all of the users level info
        record_results: AJAX request to record the results of a completed game
        generate_questions: Generates a variable amount of questions with different math types
        error_redirect: Redirects the user to the error page with a message and error code
"""


from flask import Flask, redirect, render_template, request, session, jsonify, url_for
from flask_session import Session
from helpers import login_required, error, validate_login, get_user_id, get_user_username, get_user_experience, generate_reward_experience, generate_user_level_info, generate_leaderboards, record_game_results, generate_game_history, generate_user_stats
from werkzeug.security import generate_password_hash
from database import Database
from game import Game
import json

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config['TEMPLATES_AUTO_RELOAD'] = True
Session(app)


@app.route("/", )
def index():
    """
    Renders the index.html page

    Gets called whenever the user opens the webpage for the first time
    or whever they use logout

    Return: Calls render_template on the template for index
    """
    return render_template("/index.html")



@app.route('/home', methods=['POST', 'GET'])
@login_required
def home():
    """
    Renders the /home.html page

    The home page contains the the settings for the game mode and 
    displays basic stats about the user and their previous games
    Gets called whenever the user registers or logs in from index
    can also be called by the other pages in the dropdown menu
    
    Return: calls render_template on the template for home.html
    """
    return render_template('home.html')



@app.route('/profile', methods=['POST'])
@login_required
def profile():
    """
    Renders the profile.html page 
    
    The profile page contains more detailed information about the user
    Can also search and find out stats about another user
    Gets called from any of the tabs with the dropdown menu
    
    Return: calls render_template for /profile.html with al the users level information
    """
    
    username = request.form.get('user-search')

    def calculate_percentage(operand_1, operand_2):
        # Helper function to calculate the % in html with jinja
        if operand_2 == 0:
            return 0
        result = (operand_2 / operand_1) * 100
        return round(result)

    # Gets the user_id through session if the user got to the page through the dropdown menu
    if username == None:
        user_id = session['user_id']
        username = get_user_username(user_id)
    else:
        user_id = get_user_id(username)

    with Database() as db:
        query = ("SELECT addition, subtraction, multiplication, division, exponential, total FROM levels WHERE user_id = (?);")
        parameters = (user_id, )
        user_experiences = db.fetchone(query, parameters)

    user_levels = generate_user_level_info(user_experiences)

    # Instead of reworking the entire function I just modified the list
    total_level = user_levels[-1]
    user_levels.pop()

    user_stats = generate_user_stats(user_id)

    MATH_TYPE_MAP = [['+', 'addition'], ['-', 'subtraction'], ['×', 'multiplication'], ['÷', 'division'], ['x²', 'exponential']]
    MATH_MODES_MAP = [['total', 'all_inclusive'], ['vanilla', 'icecream'], ['timed', 'timer'], ['sudden', 'skull']]

    return render_template('profile.html', user_experiences=user_experiences, user_levels=user_levels, user_stats=user_stats,
                            MATH_MODES_MAP=MATH_MODES_MAP, MATH_TYPE_MAP=MATH_TYPE_MAP, total_level=total_level, 
                            calculate_percentage=calculate_percentage, username=username)


@app.route('/leaderboard', methods=['POST'])
@login_required
def leaderboard():
    """
    Renders leaderboard.html with the updated leaderboard data

    Uses the generate_leaderboards helper function to generate 6 leaderboards
    of the top 10 users in each mode and then total which means all modes together
    The user can set how many results they want to see but by default its 10
    Can be by any page with a dropdown menu

    Return: Calls render_template on leaderboard.html with the generated leaerboards
    """
    
    quantity = request.form.get('quantity')
    leaderboards = generate_leaderboards(quantity)

    return render_template('leaderboard.html', leaderboards=leaderboards)


@app.route('/game_history', methods=['POST'])
@login_required
def game_history():
    """
    Renders game_history.html with the users advanded game history

    Generates a more detailed version of game history than the one thats offered 
    in the home page which also shows the answers for the questions
    Gets called be any page with a dropdown menu

    Return: Calls render_template on the template for game_history the users history
            and a bunch of helper functions and maps to populate the table
    """
    user_id = session['user_id']
    quantity = request.form.get('quantity')
    modes = request.form.get('active_modes')

    def calculate_percentage(operand_1, operand_2):
        # Calculates the percentage in the html using jinja
        if operand_2 == 0:
            return 0
        result = (operand_2 / operand_1) * 100
        return round(result)


    def format_date(date):
        # Formats the date from the default SQL version to a more presentable format
        timestamp, clock = date.split(' ')
        year, month, day = timestamp.split('-')
        hour, minute, _ = clock.split(':')
        
        meridiem = 'AM'
        if int(hour) > 12:
            meridiem = 'PM'
            hour = int(hour) - 12

        return f"{hour}:{minute}{meridiem} {day}/{month}/{year[2:]}"

    def cycle(game_number):
        # Adds the class 'even' or 'odd' to help with the styling of the table 
        if (game_number % 2 == 0):
            return 'even'
        return 'odd'

    def add_active_mode(mode):
        # The mode will either be true or false (string), if true add the active class to the mode
        print(modes)
        if (mode == 'true'):
            return 'active'
        return ''
        
    def parse_detailed_game_history(history_str):
        # Since the sql query returns a tuple with the last value being a long string, 
        # instead of creating a new tuple I can just use this function to parse the string.
        history_dict = json.loads(history_str)
        
        return history_dict

    modes_list = modes.split(',')
    user_game_history = generate_game_history(user_id, quantity, modes_list)
    
    # Different maps to help with the style and icons in the html
    ICON_MAP = {'vanilla': 'icecream', 'timed': 'timer', 'sudden': 'skull'}
    MODE_MAP = {'+': 'addition', '-': 'subtraction', 'x': 'multiplication', '÷': 'division', '^': 'exponential'}
    
    return render_template('game_history.html', user_game_history=user_game_history, ICON_MAP=ICON_MAP,
                           MODE_MAP=MODE_MAP, calculate_percentage=calculate_percentage, format_date=format_date, 
                           cycle=cycle, parse_detailed_game_history=parse_detailed_game_history, quantity=quantity,
                           modes_list=modes_list, add_active_mode=add_active_mode)


@app.route('/get_last_games_played', methods=['POST'])
@login_required
def get_last_games_played():
    """
    AJAX request that returns the last games played
    
    Database query that retrieves the 5 most recent games played to be displayed in home.html
    gets called whenever home.html loads or when a game is completed
    
    Return: JSONified list to send back to the javascript
    """
    
    user_id = session['user_id']
    quantity = request.form.get('quantity')

    with Database() as db:
        query = ("SELECT game_mode, questions, correct, addition_exp, subtraction_exp, multiplication_exp, division_exp, "
                "exponential_exp, game_timer FROM games WHERE user_id = (?) ORDER BY game_id DESC LIMIT (?);")

        parameters = (user_id, quantity, )

        db.execute(query, parameters)
        last_games = db.fetchall()

    return jsonify(last_games)


@app.route('/register', methods=['POST'])
def register():
    """
    Checks the users registration data and creates a database query

    Checks that the username isn't alrady registered and validates the password 
    to meet a certain standard before hashing the password and registering the user

    If the registration is somehow unsuccessful as in the user tried to modify the html
    then they will get returned an error. Javascript should be doing basic validation 
    before an AJAX request is even sent.
    
    Return: If the registration is successful the user is redirected to home.html and is logged in
            
    """
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

        user_id = db.last_insert_rowid()[0][0]

        query2 = "INSERT INTO levels (user_id) VALUES (?)"
        paramaters2 = ((user_id),)
        db.execute(query2, paramaters2)

    session['user_id'] = get_user_id(username)
    return redirect(url_for('home'))


@app.route('/login', methods=['POST'])
def login():
    """
    Logs the user in if their their username and password are valid

    Checks the usernames and password hashes to see if they are valid
    if they are then sign the user in, javascript should be validating 
    but if the user tries to modify the html they'll get an error
    
    Return: Redirects to /home.html if login is successful
    """
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
    """
    Logs the user out and redirects to index

    When the logout button in the dropdown menu is clicked it signs the user out
    clears all the session information and redirects back to index

    Return: Redirects the user back to /index.html
    """
    session.clear()
    return redirect(url_for('index'))


@app.route('/check_username_availability', methods=['POST'])
def check_username_availability():
    """
    Checks if the username is already registered by making an SQL Query

    This function is called in login, register and in any user search feature
    in the website
    
    Return: returns a JSONified bool thats either true or false depending on the availability
    """
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
    """
    Validates the users login details
    
    Uses the helper function validate_login to check if the username matches
    the and the hashed password match the username to the cooresponding password

    Return: returns a JSONified bool back to script.js letting the AJAX function know
            if it was successful or not
    """
    username = request.form.get('username')
    password = request.form.get('password')

    is_login_valid = validate_login(username, password)

    if is_login_valid == True:
        return jsonify({'valid': True})
    return jsonify({'valid': False})


@app.route('/get_user_levels', methods=['POST'])
def get_user_levels():
    """
    Gets info about the users level and experience
    
    Gets called when the users loads the homepage or successfuly finishes a game
    Contains the new updated xp and how much xp was earned last game

    Return: Returns a list of the users level and % to next level for the 5 math types
    """
    user_id = session['user_id']
    experience = get_user_experience(user_id)

    level_info_list = generate_user_level_info(experience[:-1])

    return jsonify(level_info_list)


# Gets called when a game completes successfully. Records results - Updates experience
@app.route('/record_results', methods=['POST'])
@login_required
def record_results():
    """
    Records the results when a game is successfuly completed
    
    Whenever a game is successfuly completed script.js sends an AJAX request
    to record the users results in the database
    
    Return: Returns a JSONified bool that lets script.js know that the results were recorded
    """
    user_id = session['user_id']
    results = json.loads(request.form.get('results'))

    user_experience = get_user_experience(user_id)
    reward_experience, question_experience_list = generate_reward_experience(results)
    
    record_game_results(results, reward_experience, question_experience_list, user_id)

    updated_experience = [sum(i) for i in zip(user_experience, reward_experience)]

    with Database() as db:
        query = ("UPDATE levels SET addition = (?), subtraction = (?), multiplication = (?), "
                "division = (?), exponential = (?), total = (?) WHERE user_id = (?)")
        parameters = (updated_experience[0], updated_experience[1], updated_experience[2], updated_experience[3], updated_experience[4], updated_experience[5], user_id, )
        db.execute(query, parameters)

    return jsonify({'successful': True})


@app.route('/generate_questions', methods=['POST'])
@login_required
def generate_questions():
    """
    Generates questions based on the settings provided in home.html

    The user specifies which math types and how many questions they want
    generated with the settings in home.html generates the questions from the game.py

    Return: questions {list of dicts}: Contains the question, the math type and the answer 
    """
    
    user_id = session['user_id']
    types = request.form.get('types')
    amount = request.form.get('amount')
    experience = get_user_experience(user_id)

    game = Game(types, amount, experience)
    questions = game.generate_questions()

    return jsonify(questions)


@app.route('/error_redirect', methods=['GET', 'POST'])
def error_redirect():
    """
    If an error occurs in app.py redirects to error.html

    Uses a helper function to redirect to error.html with an error message and an error code

    Return: renders the error.html page
    """
    if request.method == 'GET':
        return error('error_redirect', 'you shouldnt be seeing this')
    if request.method == 'POST':
        error_message = request.form.get('errorMessage')
        error_code = request.form.get('errorCode')

        return error(error_message, error_code)
