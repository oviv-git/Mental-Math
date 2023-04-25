from random import randint, choice
from csv import DictReader
import sys



def main():
    # Mode will only ever be a set string based off what data you collect from the user
    user_mode = "10_questions"

    # The basic layout for user_settings, more things might be added. It also might be seperated
    # if its easier to handle things that way although now that I think about it I don't know how
    # it would be easier seperate, you'll just have to update the rest of the system if it ever
    # impacts it.the thing is it shouldn't impact it becuase the new settings will always be
    # last and they'll have to be hard coded in, things wont SHIFT around

    user_settings = [
    {"type": "addition", "on": True, "level": 2},
    {"type": "subtraction", "on": True, "level": 2},
    {"type": "multiplication", "on": True, "level": 2},
    {"type": "division", "on": True, "level": 1},
    {"type": "exponential", "on": False, "level": 2},
    {"type": "radical", "on": False, "level": 2}
    ]

    user = GenerateQuestions(user_settings)

    questions_list = user.generate_list(user_mode)
    for question in questions_list:
        print(question['question'], question['answer'])

class GenerateQuestions:
    # mode dictates the amount/ other future functions
    # math_types dictates which types of math are selected
    # user is the users settings for difficulty

    def __init__(self, user_settings) -> list:
        # question_amount = self.select_mode(user_mode)
        self.question_types = self.math_types(user_settings)


    def select_mode(self, user_mode):
        # Get user_mode as input and checks if it exists in modes.csv
        # If it does then return all the settings for the corresponding mode
        with open ("modes.csv", "r", encoding="utf-8") as file:
            modes = DictReader(file)
            for mode in modes:
                if user_mode == mode['mode']:
                    return int(mode['questions'])
        sys.exit("errorcode: 1 - issue with the gamemode")
        # select mode will output mode_settings


    def math_types(self, user_settings):

        question_types = []
        for setting in user_settings:
            if setting['on'] is True:
                question_types.append({"type": setting['type'], "level": setting['level']})

        if 1 > len(question_types) > 6:
            sys.exit("errorcode: 2 - math_types error")
        return question_types

    def generate_list(self, user_mode):
        """
        Generates a list of dicts with different types of questions and their answers

        Args:
            game_mode (string): The game mode will be input every time a user starts a game.
            The settings for that game will be loaded using self.select_mode() and modes.csv  

            question_types (list of dicts): The different categories of questions 
            the user wants generated, aswell as their level in that category

        Returns:
            self.generate_list (list of dicts): Generates the questions and answers in a dict
            with the scheme: {}

        """
        function_map = {'addition': self.addition, 'subtraction': self.subtraction,
                        'multiplication': self.multiplication, 'division': self.division,
                        'exponential': self.exponential, 'radical': self.radical}

        questions_list = []
        question_amount = self.select_mode(user_mode)

        for _ in range(question_amount):
            selected = choice(self.question_types)
            result = function_map[selected['type']]

            question = result(selected['level'])
            questions_list.append(question)

        return questions_list


    def generate_number(self, length):
        min_num = 10 ** (length - 1)
        max_num = (10 ** length) - 1

        return randint(min_num, max_num)


    # The return of any of the math types should be a dict
    # {'question': '21 + 8 = ', 'answer': 29}
    def addition(self, level):
        number_length = level
        x = self.generate_number(number_length)
        y = self.generate_number(number_length)
        
        question = f"{x} + {y} ="
        answer = x + y

        return {'question': question, 'answer': answer}


    def subtraction(self, level):
        number_length = level
        while True:
            x = self.generate_number(number_length)
            y = self.generate_number(number_length)
            if x >= y:
                break
            continue
            
        question = f"{x} - {y} ="
        answer = x - y

        return {'question': question, 'answer': answer}


    def multiplication(self, level):
        number_length = level
        while True:
            x = self.generate_number(number_length)
            if x < level * 10:
                break
            continue

        while True:
            y = self.generate_number(number_length)
            if y < level * 10:
                break
            continue

        question = f"{x} x {y} ="
        answer = x * y

        return {'question': question, 'answer': answer}


    def division(self, level): # MUST GUARENTEE answer is integer
        number_length = level
        while True:
            x = self.generate_number(number_length + 1)
            y = self.generate_number(number_length)
            
            answer = round(x / y, 1)

            if str(answer)[-1] == "0":
                question = f"{x} / {y} ="
                return {'question': question, 'answer': int(answer)}
            continue


    def exponential(self): # MUST GUARENTEE answer is integer
        pass


    def radical(self): # MUST GUARENTEE answer is integer
        pass


if __name__ == "__main__":
    main()
