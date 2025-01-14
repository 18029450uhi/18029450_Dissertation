export const data = [
    {
        "originalProblem": {
            "equation": "4x + 3 = 2x + 9",
            "steps": [
                "Step 1: Subtract 2x from both sides: 4x - 2x + 3 = 9",
                "Step 2: Simplify the equation: 2x + 3 = 9",
                "Step 3: Subtract 3 from both sides: 2x = 6",
                "Step 4: Divide both sides by 2: x = 3"
            ],
            "solution": 3
        },
        "mcq":
            {
                "question":
                    "Solve the equation: 4x + 3 = 2x + 9",
                "options":
                    {
                        "A":
                            "x = 1",
                        "B":
                            "x = 2",
                        "C":
                            "x = 3",
                        "D":
                            "x = 6"
                    }
                ,
                "correctAnswer":
                    "C"
            },
        "similarQuestionMCQ":
            {
                "question":
                    "5x + 4 = 3x + 10",
                "options": {
                    "A": "x = 1",
                    "B": "x = 2 ",
                    "C": "x = 4",
                    "D": "x = 3"
                },
                "correctAnswer": 3
            }
        ,
        "hints":
            [
                {
                    "question": "What is the 1st step to solve this?",
                    "options": [
                        {
                            "option": "Subtract 1x from both sides",
                            "explanation": "Subtracting 1x is not the best option"
                        },
                        {
                            "option": "Subtract 2x from both sides",
                            "explanation": " Correct! Subtracting 2x from both sides will simplify the equation"
                        },
                        {
                            "option": "Add 1x from both sides",
                            "explanation": "Wrong! Adding 1x will add more complexity"
                        }
                    ],
                    "correct": 2
                },
                {
                    "question": "What does the equation become after subtracting 2x from both sides?",
                    "options": [
                        {
                            "option": "2x + 3 = 9",
                            "explanation": "Correct! After subtracting 2x from both sides, you get 2x + 3 = 9"
                        },
                        {
                            "option": "5x + 3 = 3x + 9",
                            "explanation": " No! That would if you add 1x to both sides"
                        },
                        {
                            "option": "3x + 3 = x + 9",
                            "explanation": "Wrong! This would only if subtracting 1x from both sides"
                        }
                    ],
                    "correct": 1
                },
                {
                    "question": "What is the next to solve the equation?",
                    "options": [
                        {
                            "option": "Subtract 3 from both sides.",
                            "explanation": "Correct! the equation will look like 2x = 6 "
                        },
                        {
                            "option": "Subtract 2x from both sides",
                            "explanation": "Wrong! there is not enough value for x on right side of the equation"
                        },
                        {
                            "option": "Subtract 6 from both side",
                            "explanation": "Not Probably the best option! Subtracting 6 will all -3 on left side and you will remain with 2x -3 = 3"
                        }
                    ],
                    "correct": 1
                },
                {
                    "question": "What you will do next to get the value of x?",
                    "options": [
                        {
                            "option": "Divide by 2.",
                            "explanation": "Correct! the value of x is 3 "
                        },
                        {
                            "option": "Divide by 3",
                            "explanation": "Wrong! not a good option"
                        },
                        {
                            "option": "Multiply by 2",
                            "explanation": "Not yet! this will add more complexity"
                        }
                    ],
                    "correct": 1
                }
            ]
    }

]

