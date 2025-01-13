import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const UploadImage = ({ onUpload }) => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (image) {
            try {
                // Perform OCR using tesseract.js
                const { data: { text } } = await Tesseract.recognize(image, 'eng');

                // Send the extracted text to OpenAI API to generate MCQs
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer YOUR_OpenAI_KEY`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo-1106",
                        messages: [
                            {
                                role: "system",
                                content: "You are a helpful math tutor. Guide the user through the solution step by step. User will also ask for similar question and hints to solve similar question. Generate MCQs for the user based on the original question. And also generate hints questions for the similar question."
                            },
                            {
                                role: "user",
                                content: `how can I solve ${text}. `
                            }
                        ],
                        response_format: {
                            type: "json_schema",
                            json_schema: {
                                mcq: {
                                    question: "Solve the equation: 4x + 3 = 2x + 9",
                                    options: {
                                        A: "x = 1",
                                        B: "x = 2",
                                        C: "x = 3",
                                        D: "x = 6"
                                    },
                                    correctAnswer: "C"
                                },
                                originalProblem: {
                                    equation: "4x + 3 = 2x + 9",
                                    steps: [
                                        "Step 1: Subtract 2x from both sides: 4x - 2x + 3 = 9",
                                        "Step 2: Simplify the equation: 2x + 3 = 9",
                                        "Step 3: Subtract 3 from both sides: 2x = 6",
                                        "Step 4: Divide both sides by 2: x = 3"
                                    ],
                                    solution: 3
                                },
                                similarProblem: {
                                    equation: "5x + 4 = 3x + 10",
                                    steps: [
                                        "Step 1: Subtract 3x from both sides: 5x - 3x + 4 = 10",
                                        "Step 2: Simplify the equation: 2x + 4 = 10",
                                        "Step 3: Subtract 4 from both sides: 2x = 6",
                                        "Step 4: Divide both sides by 2: x = 3"
                                    ],
                                    solution: 3
                                },
                                hintsToSolveSimilarProblem: [
                                    {
                                        question: "What is the 1st step to solve this?",
                                        options: [
                                            {
                                                option: "Subtract 1x from both sides",
                                                explanation: "Subtracting 1x is not the best option",
                                                afterApplyingTheOption: "4x + 3 = 2x + 10"
                                            },
                                            {
                                                option: "Subtract 3x from both sides",
                                                explanation: "Correct! Subtracting 2x from both sides will simplify the equation",
                                                afterApplyingTheOption: "2x + 4 = 10"
                                            },
                                            {
                                                option: "Add 1x from both sides",
                                                explanation: "Wrong! Adding 1x will add more complexity",
                                                afterApplyingTheOption: "6x + 4 = 4x + 10"
                                            }
                                        ],
                                        correct: 2
                                    },
                                    {
                                        question: "What is the next to solve the equation?",
                                        options: [
                                            {
                                                option: "Subtract 4 from both sides.",
                                                explanation: "Correct! the equation will look like 2x = 6",
                                                afterApplyingTheOption: "2x = 6"
                                            },
                                            {
                                                option: "Subtract 2x from both sides",
                                                explanation: "Wrong! there is not enough value for x on right side of the equation",
                                                afterApplyingTheOption: "4 = 10 -2x"
                                            },
                                            {
                                                option: "Subtract 6 from both side",
                                                explanation: "Not yet! this will add more complexity",
                                                afterApplyingTheOption: "2x -2 = 4"
                                            }
                                        ],
                                        correct: 1
                                    },
                                    {
                                        question: "What you will do next to get the value of x?",
                                        options: [
                                            {
                                                option: "Divide by 2.",
                                                explanation: "Correct! the value of x is 3",
                                                afterApplyingTheOption: "x = 3"
                                            },
                                            {
                                                option: "Divide by 3",
                                                explanation: "Wrong! not a good option",
                                                afterApplyingTheOption: "2x/3 = 2"
                                            },
                                            {
                                                option: "Multiply by 2",
                                                explanation: "Not yet! this will add more complexity",
                                                afterApplyingTheOption: "4x = 12"
                                            }
                                        ],
                                        correct: 1
                                    }
                                ]
                            },
                            strict: true
                        }
                    })
                });

                const completion = await response.json();
                console.log(completion)
                onUpload(completion.choices[0].message.content)
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadImage;