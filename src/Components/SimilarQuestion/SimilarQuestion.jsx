import React, {useCallback, useEffect, useRef, useState} from 'react';
import './SimilarQuestion.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';
// import {data} from '/Users/amir/WebstormProjects/question-app/src/response.js';
import Modal from "../Modal/Modal";
import Hints from "../Hints/Hints";
import {handleUpload} from "../../RestUtils/GetFromGemini";
import {schema} from "../../RestUtils/Schemas/HintsToSolveSimilarMCQSchema";

// const renderEquation = (step) => {
//     const parts = step.split(':');
//     const equation = parts.length > 2 ? parts.slice(2).join(':').trim() : step;
//     return {__html: katex.renderToString(equation, {throwOnError: false})};
// };

// const renderText = (step) => {
//     const parts = step.split(':');
//     const stepText = parts.slice(0, 2).join(':') + ':';
//     return {__html: stepText};
// };

const SimilarQuestion = (q) => {
    const data = JSON.parse(q.q);
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(data[index]);
    const [showHintModal, setShowHintModal] = useState(false);
    const [showHindButton, setShowHindButton] = useState(false);
    const [hintsOptions, setHintsOptions] = useState(null);
    const [hintButtonEnabled, setHintButtonEnabled] = useState(false);
    const [lock, setLock] = useState(false);

    const hasFetchedHintsOptions = useRef(false);

    const generateHintOptions = useCallback(async () => {
        if (hasFetchedHintsOptions.current) return;
        hasFetchedHintsOptions.current = true;

        try {
            const prompt = `Given the following algebra question:

${question.question}

Generate a series of step-by-step MCQ hints that guide the user towards the final step of solving the equation. Each hint should:

    Present a clear question: The hint should pose a specific question related to the problem-solving process, referencing the current equation or expression.
    Offer four plausible options: Provide four options, with one correct and three incorrect.
    Provide informative feedback: For each option, provide a detailed explanation of why it is correct or incorrect.
    Progress logically: Each hint should build upon the previous one, leading the user to the final step of solving the equation.

JSON Format:
JSON

{
  "hints": [
    {
      "step": 1,
      "hint_question": "What is the first step to solve this equation?",
      "options": [
        {
          "option": "Option A",
          "explanation": "Explanation for Option A (why it's incorrect)"
          "equation_after_applying_the_current_option": "2x = 6"
        },
        {
          "option": "Option B (Correct)",
          "explanation": "Explanation for Option B (why it's correct)"
        },
        {
          "option": "Option C",
          "explanation": "Explanation for Option C (why it's incorrect)"
        },
        {
          "option": "Option D",
          "explanation": "Explanation for Option D (why it's incorrect)"
        }
      ],
      "correct_option": "B"
    },
    {
      "step": 2,
      "hint_question": "What is the next step to simplify the equation?",
      "options": [
        // ... similar structure for options and correct answer
      ]
    }
  ]
}

Use code with caution.

Example:

Question: Solve the equation 2x + 5 = 11.

Hints:

    Hint 1:
        Hint Question: What is the first step to isolate the variable term, 2x?
        Options:
            A. Add 5 to both sides
            B. Subtract 5 from both sides
            C. Multiply both sides by 2
            D. Divide both sides by 2
        Correct Answer: B
        Feedback:
            Correct: Subtracting 5 from both sides will isolate the variable term.
            Incorrect: The other options would either complicate the equation or lead to an incorrect result.

    Hint 2:
        Hint Question: After subtracting 5 from both sides, what equation do we get?
        Options:
            A. 2x = 6
            B. 2x = 16
            C. x + 5 = 11
            D. 2x - 5 = 11
        Correct Answer: A
        Feedback:
            Correct: Subtracting 5 from both sides results in 2x = 6.
            Incorrect: The other options are incorrect due to arithmetic errors or incorrect operations.

//After the second hint, the user will be directed back to the main question screen with the equation 2x = 6. They can then solve for x independently.`;
            const result = await handleUpload(prompt, schema);
            setHintsOptions(result.response.text);
            setHintButtonEnabled(true);
        } catch (error) {
            console.error('Error:', error);
        }
    }, [data]);

    useEffect(() => {
        generateHintOptions();
    }, [generateHintOptions]);


    const updateQuestions = () => {
        setLock(false);

        const answerElements = document.querySelectorAll('li[data-answer]');
        answerElements.forEach(element => {
            element.classList.remove('correct-answer', 'incorrect-answer');
        });
    };

    const nextQuestion = () => {
        if (index < data.length - 1) {
            setIndex(index + 1);
            setQuestion(data[index + 1]);
            updateQuestions();
        }
    };

    const previousQuestion = () => {
        if (((index < data.length - 1) && index !== 0) || index === data.length - 1) {
            setIndex(index - 1);
            setQuestion(data[index - 1]);
            updateQuestions();
        }
    };


    const checkAnswerSimilarQuestion = (e, answer) => {
        if (lock === false) {
            if (answer === question.correctAnswer) {
                e.target.classList.add("correct-answer");
                e.target.classList.remove("incorrect-answer");
            } else {
                setShowHindButton(true);
                e.target.classList.add("incorrect-answer");
                const correctAnswerElement = document.querySelector(`li[data-answer="${question.correctAnswer}"]`);
                if (correctAnswerElement) {
                    correctAnswerElement.classList.add("correct-answer");
                    correctAnswerElement.classList.remove("incorrect-answer");
                }
            }
            setLock(true);
        }
    };
    return (
        <div className='similar-question'>
            <h2>Similar Question</h2>
            <h2 className='question-header'>{question.question}</h2>
            <ul className='options'>
                <li data-answer="A" className='option'
                    onClick={event => checkAnswerSimilarQuestion(event, "A")}>{question.options.A}</li>
                <li data-answer="B" className='option'
                    onClick={event => checkAnswerSimilarQuestion(event, "B")}>{question.options.B}</li>
                <li data-answer="C" className='option'
                    onClick={event => checkAnswerSimilarQuestion(event, "C")}>{question.options.C}</li>
                <li data-answer="D" className='option'
                    onClick={event => checkAnswerSimilarQuestion(event, "D")}>{question.options.D}</li>
            </ul>

            {/* Initially the */}
            <div className='buttons'>
                <button className='next-button' onClick={nextQuestion}>Next</button>
                <button className='previous-button' onClick={previousQuestion}>Previous</button>
            </div>
            <div className='index'>{index + 1} of {data.length} Questions</div>
            {
                showHindButton &&
                <button

                    className='hint-button'
                    onClick={() => setShowHintModal(!showHintModal)}
                    disabled={!hintButtonEnabled}
                >
                    Show Hint
                </button>
            }
            {
                hintsOptions && (
                    <div className={`hint-model-section ${showHintModal ? 'show' : ''}`}>
                        <Modal show={showHintModal} onClose={() => setShowHintModal(false)}>
                            <Hints h={hintsOptions}/>
                        </Modal>
                    </div>
                )
            }

        </div>
    )
        ;
};

export default SimilarQuestion;