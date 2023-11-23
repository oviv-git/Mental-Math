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

        """
        with open('levels.csv', 'r+', encoding="utf-8") as csvfile:
            levels_list = csv.reader(csvfile, delimiter=',')

            for level in levels_list:
                if user_experience < int(level[1]):
                    return int(level[0])
                    
        return 1
    
    

    def select_difficulty(self, user_level):
        """
        Based on the users level and some randomness selects the difficulty level of the question.
        
        Argument:
            level (int): The users level that will be used as a base to determine the difficulty

        Return: 
            (int): Number between 1-5 that will be the difficulty of the current question
        """
        LEVELS_MAP = {0: 5, 1: 10, 2: 15, 3: 20, 4: 25, 5: 30, 6: 35, 7: 40, 8: 45, 9: 50}

        # TODO: Clean up the way modifiers works.
        MODIFIERS = [-20, -15, -10, -8, -6, -5, -4, -3, -2, -1, 0, 0, 0, 0, 0, 1, 2]
        selected_modifier = choice(MODIFIERS)

        # Adds the modifier to the user level for a chance at an easier or harder question
        user_level += selected_modifier
        
        for difficulity, game_level in LEVELS_MAP.items():
            if user_level <= game_level:
                return difficulity
            
        return 0


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
        level = self.convert_experience(self.experience[0])
        difficulty = self.select_difficulty(level)

        ADDITION_MAP = [{'operand_1': 10, 'operand_2': 10},
                        {'operand_1': 50, 'operand_2': 20},
                        {'operand_1': 100, 'operand_2': 50},
                        {'operand_1': 200, 'operand_2': 100},
                        {'operand_1': 500, 'operand_2': 200},
                        {'operand_1': 1000, 'operand_2': 500},
                        {'operand_1': 1000, 'operand_2': 1000},
                        {'operand_1': 5000, 'operand_2': 1000},
                        {'operand_1': 10000, 'operand_2': 5000},
                        {'operand_1': 10000, 'operand_2': 10000}] 

        operand_1 = self.generate_number(ADDITION_MAP[difficulty]['operand_1'])
        operand_2 = self.generate_number(ADDITION_MAP[difficulty]['operand_2'])
        result = operand_1 + operand_2

        return {"operator": "+", "operand_1": operand_1, "operand_2": operand_2, "result": result, 
                "difficulty": difficulty + 1, "level": level}


    # TODO : explanation 
    def subtraction(self):
        level = self.convert_experience(self.experience[1])
        difficulty = self.select_difficulty(level)

        SUBTRACTION_MAP = [{'operand_1': 10, 'operand_2': 9},
                           {'operand_1': 50, 'operand_2': 49},
                           {'operand_1': 100, 'operand_2': 99},
                           {'operand_1': 200, 'operand_2': 199},
                           {'operand_1': 500, 'operand_2': 300},
                           {'operand_1': 1000, 'operand_2': 500},
                           {'operand_1': 1000, 'operand_2': 999},
                           {'operand_1': 5000, 'operand_2': 3000},
                           {'operand_1': 10000, 'operand_2': 5000},
                           {'operand_1': 10000, 'operand_2': 9999}]

        operand_1 = self.generate_number(SUBTRACTION_MAP[difficulty]['operand_1'])
        operand_2 = self.generate_number(SUBTRACTION_MAP[difficulty]['operand_2'])

        if operand_1 < operand_2:
            operand_1, operand_2 = operand_2, operand_1

        result = operand_1 - operand_2

        return {"operator": "-", "operand_1": operand_1, "operand_2": operand_2, "result": result, 
                "difficulty": difficulty + 1, "level": level}

    # TODO
    def multiplication(self):
        level = self.convert_experience(self.experience[2])
        difficulty = self.select_difficulty(level)

        MULTIPLICATION_MAP = [{'operand_1': 5, 'operand_2': 5},
                              {'operand_1': 10, 'operand_2': 5},
                              {'operand_1': 15, 'operand_2': 10},
                              {'operand_1': 25, 'operand_2': 10},
                              {'operand_1': 50, 'operand_2': 15},
                              {'operand_1': 100, 'operand_2': 20},
                              {'operand_1': 150, 'operand_2': 25},
                              {'operand_1': 200, 'operand_2': 50},
                              {'operand_1': 200, 'operand_2': 75},
                              {'operand_1': 200, 'operand_2': 100}]
        
        operand_1 = self.generate_number(MULTIPLICATION_MAP[difficulty]['operand_1'], 2)
        operand_2 = self.generate_number(MULTIPLICATION_MAP[difficulty]['operand_2'], 2)
        
        result = round(operand_1 * operand_2)

        return {"operator": "x", "operand_1": operand_1, "operand_2": operand_2, "result": result, 
                "difficulty": difficulty + 1, "level": level}

    # TODO
    def division(self):
        level = self.convert_experience(self.experience[3])
        difficulty = self.select_difficulty(level)

        DIVISION_MAP = [{'operand_1': 5, 'operand_2': 5},
                        {'operand_1': 5, 'operand_2': 10},
                        {'operand_1': 10, 'operand_2': 15},
                        {'operand_1': 10, 'operand_2': 25},
                        {'operand_1': 15, 'operand_2': 50},
                        {'operand_1': 20, 'operand_2': 100},
                        {'operand_1': 25, 'operand_2': 150},
                        {'operand_1': 50, 'operand_2': 200},
                        {'operand_1': 75, 'operand_2': 200},
                        {'operand_1': 100, 'operand_2': 200}]

        operand_1 = self.generate_number(DIVISION_MAP[difficulty]['operand_1'], 2)
        result = self.generate_number(DIVISION_MAP[difficulty]['operand_2'], 2)

        operand_2 = round(operand_1 * result)

        if operand_1 < operand_2:
            operand_1, operand_2 = operand_2, operand_1


        return {"operator": "÷", "operand_1": operand_1, "operand_2": operand_2, "result": result, 
                "difficulty": difficulty + 1, "level": level}

    # TODO
    def exponential(self):
        level = self.convert_experience(self.experience[4])
        difficulty = self.select_difficulty(level)
        
        EXPONENTIAL_MAP = [{'operand_1': 6, 'operand_2': 2},
                           {'operand_1': 9, 'operand_2': 2},
                           {'operand_1': 12, 'operand_2': 2},
                           {'operand_1': 14, 'operand_2': 2},
                           {'operand_1': 16, 'operand_2': 3},
                           {'operand_1': 20, 'operand_2': 3},
                           {'operand_1': 24, 'operand_2': 3},
                           {'operand_1': 26, 'operand_2': 4},
                           {'operand_1': 30, 'operand_2': 4},
                           {'operand_1': 30, 'operand_2': 5}]

        operand_1 = self.generate_number(EXPONENTIAL_MAP[difficulty]['operand_1'], 2)
        operand_2 = self.generate_number(EXPONENTIAL_MAP[difficulty]['operand_2'], 2)

        result = round(operand_1 ** operand_2)

        return {"operator": "^", "operand_1": operand_1, "operand_2": operand_2, "result": result, 
                "difficulty": difficulty + 1, "level": level}
    
    # TODO
    def generate_number(self, max_num, min_num = 1):
        return randint(min_num, max_num)
        
