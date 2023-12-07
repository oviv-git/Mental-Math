"""
    Collection of functions and wrappers that are used by app.py for ease of access

    Functions
        login_required: Function wrapper requring that the user is loggen in on certain pages
        get_user_id: Database query to get user_id based on a username
        validate_login: Database query to validate the users username and password
        get_user_experience: Database query to get the users experience
        generate_reward_experience: Algorithm to generate experience for each question
        generate_speed_multiplier: Generates a multiplier for the experience based on answer time
        error: Render error.html with a specific code and message
"""

from functools import wraps
from flask import session, render_template, redirect, jsonify
from database import Database
from werkzeug.security import check_password_hash
import csv
from math import exp
import json


def login_required(f):
    """ 
    Boilerplate function wrapper code referenced from CS50 PSET 9 Finance

    Function Wrapper that verifies that the session has a user_id on certain webpages
    meaning that they got there through login() or register() and not any other means

    Argument:
        f (function): Restricts access to whatever function it wraps behind the user_id check

    Return:
        f (function): If the user_id is found then return the original function
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/index")
        return f(*args, **kwargs)
    return decorated_function


def get_user_id(username):
    """
    Using the users username and a database query find the user_id associated with that username

    Argument:
        username (string): The users chosen username taken from either login or register
    Return: 
        user_id (int): The cooresponding user_id linked to username
    """

    with Database() as db:
        query = "SELECT DISTINCT id FROM users WHERE LOWER(username) = LOWER(?)"
        parameters = (username, )
        user_id = db.fetchone(query, parameters)

        return user_id[0]


def validate_login(username, password):
    """
    Checks to see if hashed password provided by the user matches the one in the database

    Arugments:
        username (string): Username provided by the user in a login form
        password (string): Password provided by the user in a login form
    Return: 
        (bool): Returns true if the login is valid
    """

    with Database() as db:
        query = "SELECT DISTINCT hash FROM users WHERE LOWER(username) = LOWER(?)"
        parameters = (username, )
        user_hash = db.fetchone(query, parameters)

        is_login_valid = check_password_hash(user_hash[0], password)

        if is_login_valid == True:
            return True
        return False


def get_user_experience(user_id):
    """
    Database query gets a list of the users experience for each question type
    
    Argument:
        user_id (int): The user_id that can be linked to that users levels in the database
    Return:
        user_experience (list): A list containing 5 numbers, each number represents the users xp
    """
    
    with Database() as db:
        query = "SELECT addition, subtraction, multiplication, division, exponential, total FROM levels WHERE user_id = (?)"
        parameters = (user_id, )
        return db.fetchone(query, parameters)


def generate_reward_experience(results):
    """
    The algorithm that generates experience for each question answered, returns all the reward xp in a list
    
    Argument:
        results (JSON object): Sent as an AJAX request from home.html and contains information about each question
        Example: 'correct': true, 'operator': '+', 'timeElapsed': 1.22, 'difficulty': 2, 'level': 14
    Return:
        reward_experience (list): A list containing 5 numbers
    """
    
    reward_experience = [0, 0, 0, 0, 0, 0]
    GAME_MODE_MULTIPLIER_MAP = {'vanilla': 1, 'timed': 1.2, 'choice': 0.8, 'sudden': 1.5}
    total = 0;

    for i, question in enumerate(results):

        if i == 0:
            game_mode_multiplier = GAME_MODE_MULTIPLIER_MAP[question['game_mode']]
            continue

        # If the question is wrong move onto the next one; 0 xp gained
        if question['correct'] != True:
            continue
        
        # Parts of the question object
        level = question['level']
        difficulty = question['difficulty']
        time_elapsed = question['time_elapsed']

        # Different Multipliers to modify the experience scaling per level
        level_multiplier = round(level * 0.50, 3) + 1
        difficulty_multiplier = round(difficulty * level_multiplier, 3)
        speed_multiplier = generate_speed_multiplier(time_elapsed, difficulty)

        experience_gained = round(difficulty_multiplier * speed_multiplier * game_mode_multiplier)

        # print(f'{question}\n    Experience: {experience_gained}     Speed: {speed_multiplier}       Level: {level_multiplier}       Difficulty: {difficulty_multiplier} ')

        OPERATOR_MAP = {'+': 0, '-': 1, 'x': 2, '÷': 3, '^': 4}
        operator = question['operator']

        reward_experience[OPERATOR_MAP[operator]] += experience_gained
        total += experience_gained

    reward_experience[-1] = total
    return reward_experience


def generate_speed_multiplier(time, difficulty):
    """
    Based on how long it takes the user to answer, generate a multiplier for the generated xp

    Arguments:
        time (float): Time is received from an AJAX request and is a fixed point decimal
        difficulty (int): For more difficult questions, more time is given for the multiplier

    Return:
        (float): The return value gets lower the longer you take per question, 5 seconds * difficulty
        is how you find out how long the user must take to get a 1 as a return (no bonus)
    """
    try:
        time = float(time)
        difficulty = int(difficulty)
    except ValueError:
        return 1
    
    MAX_MULTIPLIER = 5
    MULTIPLIER_DECAY_RATE = round(0.5 / difficulty, 2)

    multiplier = max(MAX_MULTIPLIER * exp(-MULTIPLIER_DECAY_RATE * abs(time)), 1)
    # print(multiplier)

    return multiplier

def generate_user_level_info(experience_list):
    """
    Generates a list containing the users level and % to next level for each math type
    so the experience bars in the results container can be updarted
    
    Arguements:
        experience (list of ints): each index represents the users experience in a specific math type
    
    Return:
    """

    user_level_info = []    
    with open('levels.csv', 'r+', encoding='utf-8') as csvfile:
        levels_list = csv.reader(csvfile, delimiter=',')

        for user_experience in experience_list:

            last_level_experience = 0
            last_level = 1

            for level in levels_list:
                if user_experience > int(level[1]):
                    last_level = level[0]
                    last_level_experience = int(level[1])
                    continue

                if user_experience <= int(level[1]):
                    type_level = int(last_level)
                    break
            
            percentage = round((user_experience - last_level_experience) /
                               (int(level[1]) - last_level_experience) * 100)

            # Since its impossible to devide by 0, manually set the % to 0 if the user is lvl 1 with 1 xp
            # The xp bar on homepage should be empty(0%) even though the user technically has 1/1 (100%) xp
            if type_level == 1 and percentage == 100:
                percentage = 0

            # Convert percentage into string to easily insert into an elements width in script.js
            percentage = f'{percentage}%'
            
            user_level_info.append({'level': type_level, 'percentage': percentage})

            csvfile.seek(0)

    return user_level_info

# TODO - DONT FORGET TO ADD TOP MESSAGE
def record_game_results(results, reward_experience, user_id):
    # question_types = {'+': 0, '-': 0, 'x': 0, '÷': 0, '^': 0}
    correct_count = 0
    questions = len(results) - 1
    questions_dict = {}

    for i, question in enumerate(results):

        # Will only run the first loop
        if i == 0:
            game_mode = question['game_mode']
            game_timer = question['game_timer']
            game_date = question['game_date']
            continue
        
        # question_types[question['operator']] += 1
        
        if question['correct']:
            correct_count += 1

        question_data = {'operand_1': question['operand_1'], 'operator': question['operator'], 
                         'operand_2': question['operand_2'], 'user_result': question['user_result'],
                         'question_result': question['question_result'], 'difficulty': question['difficulty'],
                         'level': question['level'], 'question_timer': question['question_timer']}
        
        questions_dict[i] = question_data
    
    

    with Database() as db:
        query = ("INSERT INTO games(user_id, game_mode, questions, correct, "
                "addition_exp, subtraction_exp, multiplication_exp, division_exp, exponential_exp, game_timer, game_date, question_data) " 
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);")
        
        parameters = (user_id, game_mode, questions, correct_count, reward_experience[0], 
                      reward_experience[1], reward_experience[2], reward_experience[3], reward_experience[4],
                      game_timer, game_date, json.dumps(questions_dict))
        
        db.execute(query, parameters)
    

# TODO - DONT FORGET TO ADD TOP MSG
def generate_leaderboards(quantity, query_type):
    levels_list = []

    with open('levels.csv', 'r+', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        # for level in levels_list:
        for row in reader:
            levels_list.append(row)

    leaderboards = []
    db = Database()
    
    MATH_TYPES_MAP = ['total', 'addition', 'subtraction', 'multiplication', 'division', 'exponential']
    
    for math_type in MATH_TYPES_MAP:
        query = (f"SELECT U.username, L.{math_type} FROM users U LEFT JOIN levels L ON U.id = L.user_id ORDER BY L.{math_type} DESC LIMIT (?);")
        parameters = (quantity, )

        db.execute(query, parameters)
        temp_user_experience = db.fetchall()
        user_experience = []

        for user in temp_user_experience:
            for level in levels_list:
                temp_user = [user[0], user[1]]
                if (math_type != 'total'):
                    if user[1] < int(level[1]):
                        user_level = level[0]
                        temp_user.append(user_level)
                        break
                else:
                    if user[1] < (int(level[1]) * 5):
                        user_level = level[0]
                        temp_user.append(user_level)
                        break
            user_experience.append(temp_user)
        
        leaderboards.append({'math_type':math_type, 'leaderboard': user_experience})
    
    # query2 = (f"SELECT U.username, L.total FROM users U LEFT JOIN levels L ON U.id = L.user_id ORDER BY L.total DESC LIMIT (?);")
    # parameters2 = (quantity, )

    # db.execute(query2, parameters2)
    # temp_user_experience = db.fetchall()
    # user_experience = []

    return leaderboards


# TODO - DONT FORGET TO ADD TOP MSG
def error(message, code=400):
    """
    Redirects to error.html with an error code and a message detaling the nature of the error to the user
    
    Arguments:
        message (string): Error message that displays on the page detailing the error
        code (int): The cooresponding error code that gives more information about the error
    Return:
        render_template (webpage): Redirects to error.html with the included code and message
    """

    return render_template("error.html", code=code, message=message)


def generate_game_history(user_id, quantity):
    with Database() as db:
        query = ("SELECT game_mode, questions, correct, addition_exp, subtraction_exp, multiplication_exp, "
                "division_exp, exponential_exp, game_timer, game_date, question_data " 
                "FROM games WHERE user_id = (?) ORDER BY game_id DESC LIMIT (?);")
        parameters = (user_id, quantity)

        db.execute(query, parameters, )
        game_history = db.fetchall()

    return game_history