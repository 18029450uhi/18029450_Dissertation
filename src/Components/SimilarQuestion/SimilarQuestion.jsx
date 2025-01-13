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

const SimilarQuestion = ({ q }) => {
    const data = JSON.parse(q);
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(data[index]);
    const [showHintModal, setShowHintModal] = useState(false);
    const [showHintButton, setShowHintButton] = useState(false);
    const [hintsOptions, setHintsOptions] = useState(null);
    const [hintButtonEnabled, setHintButtonEnabled] = useState(false);
    const [lock, setLock] = useState(false);

    // Track indices where hints have already been fetched
    const fetchedIndices = useRef(new Set());

    const generateHintOptions = useCallback(async () => {
        if (fetchedIndices.current.has(index)) return;
        fetchedIndices.current.add(index);

        try {
            const prompt = `Given the following algebra question:

${question.question}

Generate a series of step-by-step multiple-choice hints (MCQs) that guide the user toward solving the equation. Each hint must:

    Pose a clear question: Each hint should present a specific question related to the problem-solving process, referencing the current equation or expression.
    Offer four plausible options: Provide four options, with one correct answer and three plausible but incorrect ones.
    Include informative feedback: For each option, provide a detailed explanation of why it is correct or incorrect.
    Show updated equations: After the correct step, display the updated equation to show the progress made.
    Progress logically: Each hint should build on the previous one, gradually leading the user toward the final solution.

Output Format

{
  "hints": [
    {
      "step": 1,
      "hint_question": "What is the first step to solve this equation?",
      "options": [
        {
          "option": "Option A",
          "explanation": "Explanation for Option A (why it's incorrect)."
        },
        {
          "option": "Option B (Correct)",
          "explanation": "Explanation for Option B (why it's correct)."
        },
        {
          "option": "Option C",
          "explanation": "Explanation for Option C (why it's incorrect)."
        },
        {
          "option": "Option D",
          "explanation": "Explanation for Option D (why it's incorrect)."
        }
      ],
      "correct_option": "B",
      "updated_equation": "Updated equation after the correct step."
    },
    {
      "step": 2,
      "hint_question": "What is the next step to simplify the equation?",
      "options": [
        {
          "option": "Option A",
          "explanation": "Explanation for Option A (why it's correct)."
        },
        {
          "option": "Option B",
          "explanation": "Explanation for Option B (why it's incorrect)."
        },
        {
          "option": "Option C",
          "explanation": "Explanation for Option C (why it's incorrect)."
        },
        {
          "option": "Option D",
          "explanation": "Explanation for Option D (why it's incorrect)."
        }
      ],
      "correct_option": "A",
      "updated_equation": "Updated equation after the correct step."
    }
  ],
  "final_hint": "Now that you have the simplified equation, solve for the variable independently."
}

Example

Question: Solve the equation 2x+5=112x+5=11.
Step 1:

    Hint Question: What is the first step to isolate the variable term 2x2x?

Options:

    A. Add 5 to both sides
        Explanation: Adding 5 increases the constant, which complicates the equation instead of simplifying it.
    B. Subtract 5 from both sides (Correct)
        Explanation: Subtracting 5 removes the constant term on the left side, helping isolate 2x2x.
    C. Multiply both sides by 2
        Explanation: Multiplying both sides prematurely does not simplify the equation.
    D. Divide both sides by 2
        Explanation: Division happens later, after isolating 2x2x.

Correct Option: B
Updated Equation: 2x=62x=6
Step 2:

    Hint Question: After subtracting 5 from both sides, what equation do we get?

Options:

    A. 2x=62x=6 (Correct)
        Explanation: Subtracting 5 from 2x+5=112x+5=11 simplifies to 2x=62x=6.
    B. 2x=162x=16
        Explanation: This results from adding instead of subtracting.
    C. x+5=11x+5=11
        Explanation: This is the original equation, no steps have been taken.
    D. 2x−5=112x−5=11
        Explanation: This reflects an incorrect operation where subtraction was misapplied.

Correct Option: A
Updated Equation: 2x=62x=6
Final Hint

Now that the equation is 2x=62x=6, solve for xx by dividing both sides by 2.` ; // Provide the appropriate prompt logic
            const result = await handleUpload(prompt, schema);
            setHintsOptions(result.response.text);
            setHintButtonEnabled(true);
        } catch (error) {
            console.error('Error fetching hints:', error);
        }
    }, [index]);

    useEffect(() => {
        setQuestion(data[index]); // Update the question whenever the index changes
        generateHintOptions(); // Fetch hint options
    }, [index, data, generateHintOptions]);

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
            updateQuestions();
        }
    };

    const previousQuestion = () => {
        if (index > 0) {
            setIndex(index - 1);
            updateQuestions();
        }
    };

    const checkAnswerSimilarQuestion = (e, answer) => {
        if (!lock) {
            if (answer === question.correctAnswer) {
                e.target.classList.add('correct-answer');
            } else {
                setShowHintButton(true);
                e.target.classList.add('incorrect-answer');
                const correctAnswerElement = document.querySelector(`li[data-answer="${question.correctAnswer}"]`);
                if (correctAnswerElement) {
                    correctAnswerElement.classList.add('correct-answer');
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
                {Object.entries(question.options).map(([key, value]) => (
                    <li
                        key={key}
                        data-answer={key}
                        className='option'
                        onClick={(event) => checkAnswerSimilarQuestion(event, key)}
                    >
                        {value}
                    </li>
                ))}
            </ul>

            <div className='buttons'>
                <button className='next-button' onClick={nextQuestion}>Next</button>
                <button className='previous-button' onClick={previousQuestion}>Previous</button>
            </div>
            <div className='index'>{index + 1} of {data.length} Questions</div>

            {showHintButton && (
                <button
                    className='hint-button'
                    onClick={() => setShowHintModal(!showHintModal)}
                    disabled={!hintButtonEnabled}
                >
                    Show Hint
                </button>
            )}

            {hintsOptions && (
                <div className={`hint-modal-section ${showHintModal ? 'show' : ''}`}>
                    <Modal show={showHintModal} onClose={() => setShowHintModal(false)}>
                        <Hints h={hintsOptions} x={question.question} />
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default SimilarQuestion;
