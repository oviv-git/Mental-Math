from random import randint

# THIS IS THE MOST UP TO DATE VERSION SHOULD SEE THIS ON GITHUB

def main():
    # Mode will only ever be a set string based off what data you collect from the user
    user_mode = "5_questions"

    # The basic layout for the type list
    user_settings = [
    {"type": "addition", "on": True},
    {"type": "subtraction", "on": True},
    {"type": "multiplication", "on": False},
    {"type": "division", "on": False},
    {"type": "exponential", "on": False},
    {"type": "radical", "on": False}
]
    # for now user will be just a number to get basic functionality going. 
    # In the future it will be all the users levels and then based on that it will generate different difficulty problems 
    user_acc = 2

    questions = GenerateQuestions(user_mode, user_settings)


class GenerateQuestions:
    # mode dictates the amount/ other future functions
    # math_types dictates which types of math are selected
    # user is the users settings for difficulty 

    def __init__(self, mode, math_types, user=1) -> list:
        mode = self.select_mode(mode)


    def select_mode(self, mode):
        pass
        return mode
        # select mode will output mode_settings



    def math_types(self, ):
        pass
    

    def generate_list(self, mode, math_types, ):
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