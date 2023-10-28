import math
import csv

def main():
    levels_list = generate_experience()
    write_csv(levels_list)
    

def generate_experience():
    """
        Simple algorithm used to generate levels and experience
    
    Return: 
        levels_list (list of dicts) - can alter the range to change how many lvls there are
    """
    
    levels_list = []
    multiplier = 3

    for level in range(1, 51):
        experience = round(math.pow(level, multiplier))
        levels_list.append({level: experience})

    return levels_list


def write_csv(levels_list):
    """
    Creates/overwrites a file called levels.csv containing each level and the cooresponding exp
    
    Keyword arguments:
        levels-list (list of dicts) -- contains each level in the format {level(int): exp(int)} 
    Return: 
        Writes to a file
    """
    
    with open('levels.csv', 'w+', encoding="utf-8") as csvfile:
        csvwriter = csv.writer(csvfile, lineterminator = '\n')

        for elem in levels_list:
            for level, xp in elem.items():
                csvwriter.writerow([level, xp])

main()