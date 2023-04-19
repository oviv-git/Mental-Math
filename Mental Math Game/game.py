from random import randint

def main():
    # Mode will only ever be a set string based off what data you collect from the user
    mode = "5_questions"

    # The basic layout for the type list
    math_types = [
    {"type": "addition", "on": True},
    {"type": "subtraction", "on": True},
    {"type": "multiplication", "on": False},
    {"type": "division", "on": False},
    {"type": "exponential", "on": False},
    {"type": "radical", "on": False}
]
    # for now user will be just a number to get basic functionality going. 
    user = 2

    questions = GenerateQuestions(mode, math_types, user)


class GenerateQuestions:
    # mode dictates the amount/ other future functions
    # math_types dictates which types of math are selected
    # user is the users settings for difficulty 

    def __init__(self, mode, math_types, user=1) -> list:
        
    

    def generate_list():
        pass


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