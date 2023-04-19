from random import randint
import csv
import sys

# THIS IS THE MOST UP TO DATE VERSION SHOULD SEE THIS ON GITHUB

def main():
    # Mode will only ever be a set string based off what data you collect from the user
    user_mode = "5_questions"

    # The basic layout for user_settings, more things might be added. It also might be seperated
    # if its easier to handle things that way although now that I think about it I don't know how
    # it would be easier seperate, you'll just have to update the rest of the system if it ever
    # impacts it.the thing is it shouldn't impact it becuase the new settings will always be 
    # last and they'll have to be hard coded in, things wont SHIFT around

    user_settings = [
    {"type": "addition", "on": True, "level": 2},
    {"type": "subtraction", "on": True, "level": 2},
    {"type": "multiplication", "on": False, "level": 2},
    {"type": "division", "on": False, "level": 2},
    {"type": "exponential", "on": False, "level": 2},
    {"type": "radical", "on": False, "level": 2}
    ]

    questions_list = GenerateQuestions(user_mode, user_settings)
    print(questions_list)


class GenerateQuestions:
    # mode dictates the amount/ other future functions
    # math_types dictates which types of math are selected
    # user is the users settings for difficulty 

    def __init__(self, user_mode, user_settings) -> list:
        question_amount = self.select_mode(user_mode)
        question_types = self.math_types(user_settings)
        questions_list = self.generate_list(question_amount, question_types)
        print(questions_list)


    def select_mode(self, user_mode):
        # Get user_mode as input and checks if it exists in modes.csv
        # If it does then return all the settings for the corresponding mode
        with open ("modes.csv") as file:
            modes = csv.DictReader(file)
            for mode in modes:
                if user_mode == mode['mode']:
                    return int(mode['questions'])
                
        sys.exit("errorcode: 1 - issue with the gamemode")
        # select mode will output mode_settings


    def math_types(self, user_settings):
        
        math_types_list = []
        for setting in user_settings:
            if setting['on'] is True:
                math_types_list.append({"type": setting['type'], "level": setting['level']})

        if 1 > len(math_types_list) > 6:
            sys.exit("errorcode: 2 - math_types error")
        return math_types_list

    def generate_list(self, question_amount, question_types):
        # for i in range (question_amount):
            # user random choice to select one of the question types and then generate a question of that type
            # using the levels 
        return "TODO"


    def generate_number(self, length):
        min_num = 10 ** (length - 1)
        max_num = (10 ** length) - 1

        return randint(min_num, max_num)


    def addition(self):
        pass


    def subtraction(self):
        pass


    def multiplication(self):
        pass


    def division(self): # MUST GUARENTEE answer is integer
        pass


    def exponential(self): # MUST GUARENTEE answer is integer
        pass


    def radical(self): # MUST GUARENTEE answer is integer
        pass


if __name__ == "__main__":
    main()
