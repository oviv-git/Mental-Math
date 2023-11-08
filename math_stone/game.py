from random import randint, choice
from csv import DictReader
import sys
import csv
import json

class Game:
    def __init__(self, types, amount, experience):
        self.active_types_list = []
        self.select_types(types)
        self.experience = experience

        self.level = 1
        self.amount = amount


    # locks in the math types for that created object
    def select_types(self, types):
        
        types_dict = json.loads(types)

        for type, active in types_dict.items():
            if active == True:
                self.active_types_list.append(type)


    # Converts the users experience into a level
    def convert_experience(self, user_experience):
        """
        TODO
        """
        with open('levels.csv', 'r+', encoding="utf-8") as csvfile:
            levels_list = csv.reader(csvfile, delimiter=',')

            for level in levels_list:
                # print(type(level[1]), type(user_experience))
                if user_experience < int(level[1]):
                    return int(level[0])
                    
        return 1
    
    

    def select_difficulty(self, level):
        """
        Based on the users level and some randomness selects the difficulty level of the question.
        
        Argument:
            level (int): The users level that will be used as a base to determine the difficulty

        Return: 
            (int): Number between 1-5 that will be the difficulty of the current question
        """
        MODIFIERS = [-20, -15, -10, -8, -6, -5, -4, -3, -2, -1, 0, 0, 0, 0, 0, 1, 2]

        # level = int(level)

        selected_modifier = choice(MODIFIERS)
        level += selected_modifier
        
        # TODO : Clean up this code

        if level <= 5:
            return 1
        if level <= 15:
            return 2
        if level <= 25:
            return 3
        if level <= 35:
            return 4
        if level <= 45:
            return 5


    # TODO: explanation
    def generate_questions(self):
        questions_list = []
        for _ in range(int(self.amount)):
            question_type = choice(self.active_types_list)
            question = getattr(self, question_type)()

            questions_list.append(question)
        return questions_list
    

    # TODO : explanation
    def addition(self):
        # TODO: Replace the auto-selected level with the users level sheet.
        level = self.convert_experience(self.experience[0])
        difficulty = self.select_difficulty(level)

        operand_1 = self.generate_number(difficulty)
        operand_2 = self.generate_number(difficulty)
        result = operand_1 + operand_2

        return {"operator": "+", "operand_1": operand_1, "operand_2": operand_2, "result": result, 
                "difficulty": difficulty, "level": level}


    # TODO : explanation 
    def subtraction(self):
        level = self.convert_experience(self.experience[1])
        difficulty = self.select_difficulty(level)

        operand_1 = self.generate_number(difficulty)
        operand_2 = self.generate_number(difficulty)

        if operand_2 > operand_1:
            operand_2, operand_1 = operand_1, operand_2

        result = operand_1 - operand_2

        return {"operator": "-", "operand_1": operand_1, "operand_2": operand_2, "result": result, 
                "difficulty": difficulty, "level": level}

    # TODO
    def multiplication(self):
        level = self.convert_experience(self.experience[2])

        return 'multiplication'

    # TODO
    def division(self):
        level = self.convert_experience(self.experience[3])

        return 'division'

    # TODO
    def exponential(self):
        level = self.convert_experience(self.experience[4])

        return 'exponential'
    
    # TODO
    def generate_number(self, length):
        min_num = 10 ** (length - 1)
        max_num = (10 ** length) - 1

        return randint(min_num, max_num)
        
