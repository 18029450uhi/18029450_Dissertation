import React, {useCallback, useEffect, useRef, useState} from 'react';
import './SimilarQuestion.css';
import 'katex/dist/katex.min.css';
import Modal from "../Modal/Modal";
import Hints from "../Hints/Hints";
import {handleUpload} from "../../RestUtils/GetFromGemini";
import {schema} from "../../RestUtils/Schemas/HintsToSolveSimilarMCQSchema";


const SimilarQuestion = ({q}) => {

    const data = JSON.parse(q);
    const [index, setIndex] = useState(0);
    const [hintSteps, setHindSteps] = useState([]);
    const [isViewedHint, setIsViewedHint] = useState(false);
    const [question, setQuestion] = useState(data[index]);
    const [showHintModal, setShowHintModal] = useState(false);
    const [showHintButton, setShowHintButton] = useState(false);
    const [hintsOptions, setHintsOptions] = useState(null);
    const [hintButtonEnabled, setHintButtonEnabled] = useState(false);
    const [lock, setLock] = useState(false);

    useEffect(() => {
        const parsedData = JSON.parse(q);
        setIndex(0); // Reset index when q changes
        setQuestion(parsedData[0]); // Set the first question
        setHintButtonEnabled(false); // Reset hint button state
        fetchedIndices.current.clear(); // Clear fetched indices
        setHintsOptions(null); // Reset hints options
        setHindSteps([]); // Reset hint steps
        setIsViewedHint(false); // Reset hint view state
        setShowHintButton(false); // Reset hint button state
        setLock(false);
        clearAllSelections();
    }, [q]); // Run the effect whenever `q` changes


    // Track indices where hints have already been fetched
    const fetchedIndices = useRef(new Set());

    const generateHintOptions = useCallback(async () => {
        if (fetchedIndices.current.has(index)) return;
        fetchedIndices.current.add(index);

        try {
            const prompt = `Act as a math educator specializing in algebra for middle school, high school, and advanced-level mathematics (Nat 5, GCSE, and higher levels).

Analyze the following algebraic question:

${question.question}

Task:
Generate step-by-step multiple-choice hints (MCQs) that:

    Ask Focused Questions - Each hint must address one logical step in solving the equation or expression.
    Provide 4 Options - Include one correct answer and three plausible but incorrect options to challenge understanding.
    Explain Each Option - Offer brief explanations for why each option is correct or incorrect to reinforce learning.
    Show Progress Updates - Display the updated equation or expression after each step to show progress.
    Adapt to Problem Type - Automatically adjust hints for:
        Simplification
        Factorization
        Solving linear and quadratic equations
        Simultaneous equations
        Substitution and evaluation
        Inequalities and expressions
    Encourage Active Learning - Avoid providing direct answers. Instead, focus on guiding the student to think critically and work through each step logically.

Output Format

{
  "hints": [
    {
      "step": 1,
      "hint_question": "What is the first step to simplify this expression?",
      "options": [
        { "option": "Option A", "explanation": "Reason why Option A is incorrect." },
        { "option": "Option B (Correct)", "explanation": "Reason why Option B is correct." },
        { "option": "Option C", "explanation": "Reason why Option C is incorrect." },
        { "option": "Option D", "explanation": "Reason why Option D is incorrect." }
      ],
      "correct_option": "B",
      "updated_equation": "Updated equation or expression after this step."
    },
    {
      "step": 2,
      "hint_question": "What is the next step to factorize this expression?",
      "options": [
        { "option": "Option A", "explanation": "Reason why Option A is correct." },
        { "option": "Option B", "explanation": "Reason why Option B is incorrect." },
        { "option": "Option C", "explanation": "Reason why Option C is incorrect." },
        { "option": "Option D", "explanation": "Reason why Option D is incorrect." }
      ],
      "correct_option": "A",
      "updated_equation": "Updated factorized form."
    }
  ],
  "final_hint": "Use the simplified or factorized form to proceed to the next step and verify your result."
}`; // Provide the appropriate prompt logic
            const result = await handleUpload(prompt, schema);
            setHintsOptions(result.response.text);
            setHintButtonEnabled(true);
        } catch (error) {
            console.error('Error fetching hints:', error);
        }
    }, [question, index]);

    useEffect(() => {
        if (hintsOptions) {
            const hintsMap = JSON.parse(localStorage.getItem("hintsMap")) || {};
            hintsMap[question.question] = hintsOptions; // Store the key-value pair
            localStorage.setItem("hintsMap", JSON.stringify(hintsMap));
        }
    }, [hintsOptions, question.question]);

    const clearAllSelections = () => {
        const answerElements = document.querySelectorAll('li[data-answer]');
        answerElements.forEach(element => {
            element.classList.remove('correct-answer', 'incorrect-answer');
        });
    }

    useEffect(() => {
        const localData = getLocalStorage();
        const questionKey = question.question;

        if (localData[questionKey] !== undefined) {
            setHintsOptions(localData[questionKey]);
            setHintButtonEnabled(true);
        } else {
            generateHintOptions();
        }
    }, [index, generateHintOptions, question.question]);

    const getLocalStorage = () => {
        try {
            return JSON.parse(localStorage.getItem("hintsMap")) || {};
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return {};
        }
    };
    const updateQuestions = () => {
        setLock(false);
        clearAllSelections();
    };
    const updateHintsStep = (hintsOptions) => {
        const parsedHints = JSON.parse(hintsOptions);
        const hintIndexes = JSON.parse(localStorage.getItem("hintIndexes")) || {};
        const length = hintIndexes[question.question];
        const steps = [];
        for (let i = 0; i < length; i++) {
            steps.push(parsedHints[i].correctAnswer.correct_equation);
        }
        setHindSteps(steps);
    };
    const nextQuestion = () => {
        if (index < data.length - 1) {
            const newIndex = index + 1;
            setIndex(newIndex);
            setQuestion(data[newIndex]); // Use the updated index to fetch the next question
            updateQuestions();
            resetHintState();
        }
    };

    const previousQuestion = () => {
        if (index > 0) {
            const newIndex = index - 1;
            setIndex(newIndex);
            setQuestion(data[newIndex]); // Use the updated index to fetch the previous question
            updateQuestions();
            resetHintState();
        }
    };

    const resetHintState = () => {
        setIsViewedHint(false);
        setHindSteps([]);
        setShowHintButton(false);
        setHintsOptions(null);
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
            {isViewedHint && (
                <div className='hint-steps'>
                    {hintSteps.map((step, index) => (
                        <div key={index}>{step}</div>
                    ))}
                </div>
            )}
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
                    <Modal show={showHintModal} onClose={() => {
                        setShowHintModal(false);
                        updateHintsStep(hintsOptions);
                        setIsViewedHint(true)
                    }}>
                        <Hints h={hintsOptions} x={question.question}/>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default SimilarQuestion;
