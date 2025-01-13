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
    const [hintsOptions, setHintsOptions] = useState(null);
    const [hintButtonEnabled, setHintButtonEnabled] = useState(false);
    const [lock, setLock] = useState(false);

    const hasFetchedHintsOptions = useRef(false);

    const generateHintOptions = useCallback(async () => {
        if (hasFetchedHintsOptions.current) return;
        hasFetchedHintsOptions.current = true;

        try {
            const prompt = `Given the following question: '${question.question}', perform the following tasks:

    Generate a series of step-by-step MCQ hints that guide the user towards the correct solution. Each hint should:

    Present a clear question: The hint should pose a specific question related to the problem-solving process, referencing the current equation or expression.
    Offer four plausible options: Provide four options, with one correct and three incorrect.
    Provide informative feedback: For each option, provide a detailed explanation of why it is correct or incorrect.
    Progress logically: Each hint should build upon the previous one, leading the user closer to the final solution.

    {
      "similar_mcq": {
        "question": "Text of the new question",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_option": "Option A"
      },
      "hints": [
        {
          "step": 1,
          "hint_question": "Hint question text for step 1",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct_option": "Option A",
          "feedback": {
            "correct": "Explanation of why the option is correct",
            "incorrect": "Explanation of why the option is incorrect"
          }
        },
        {
          "step": 2,
          "hint_question": "Hint question text for step 2",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct_option": "Option B",
          "feedback": {
            "correct": "Explanation of why the option is correct",
            "incorrect": "Explanation of why the option is incorrect"
          }
        }
        // Add more steps as needed
    ]
}.`;
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
            <ul>
                <li data-answer="A"
                    onClick={event => checkAnswerSimilarQuestion(event, "A")}>{question.options.A}</li>
                <li data-answer="B"
                    onClick={event => checkAnswerSimilarQuestion(event, "B")}>{question.options.B}</li>
                <li data-answer="C"
                    onClick={event => checkAnswerSimilarQuestion(event, "C")}>{question.options.C}</li>
                <li data-answer="D"
                    onClick={event => checkAnswerSimilarQuestion(event, "D")}>{question.options.D}</li>
            </ul>
            <div className='buttons'>
                <button className='next-button' onClick={nextQuestion}>Next</button>
                <button className='previous-button' onClick={previousQuestion}>Previous</button>
            </div>
            <div className='index'>{index + 1} of {data.length} Questions</div>
            <button

                className='hint-button'
                onClick={() => setShowHintModal(!showHintModal)}
                disabled={!hintButtonEnabled}
            >
                Show Hint
            </button>

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