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
    const similarMCQ = JSON.parse(q.q);
    // const [index, setIndex] = useState(0);
    // const [question, setQuestion] = useState(data[index]);
    const [showHintModal, setShowHintModal] = useState(false);
    const [hintsOptions, setHintsOptions] = useState(null);
    const [lock, setLock] = useState(false);

    const hasFetchedHintsOptions = useRef(false);

    const generateHintOptions = useCallback(async () => {
        if (hasFetchedHintsOptions.current) return;
        hasFetchedHintsOptions.current = true;

        try {
            const prompt = `Generate a hints options to solve the similar MCQ. Which is based on this question: ${similarMCQ.question}.`;
            const result = await handleUpload(prompt, schema);
            setHintsOptions(result.response.text);
        } catch (error) {
            console.error('Error:', error);
        }
    }, [similarMCQ]);

    useEffect(() => {
        generateHintOptions();
    }, [generateHintOptions]);


    // const updateQuestions = () => {
    //     setLock(false);
    //
    //     const answerElements = document.querySelectorAll('li[data-answer]');
    //     answerElements.forEach(element => {
    //         element.classList.remove('correct-answer', 'incorrect-answer');
    //     });
    // };

    // const nextQuestion = () => {
    //     if (index < data.length - 1) {
    //         setIndex(index + 1);
    //         setQuestion(data[index + 1]);
    //         updateQuestions();
    //     }
    // };
    //
    // const previousQuestion = () => {
    //     if (((index < data.length - 1) && index !== 0) || index === data.length) {
    //         setIndex(index - 1);
    //         setQuestion(data[index - 1]);
    //         updateQuestions();
    //     }
    // };
    //

    const checkAnswerSimilarQuestion = (e, answer) => {
        if (lock === false) {
            if (answer === similarMCQ.correctAnswer) {
                e.target.classList.add("correct-answer");
                e.target.classList.remove("incorrect-answer");
            } else {
                e.target.classList.add("incorrect-answer");
                const correctAnswerElement = document.querySelector(`li[data-answer="${similarMCQ.correctAnswer}"]`);
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
            <h2 className='question-header'>{similarMCQ.question}</h2>
            <ul>
                <li data-answer="A"
                    onClick={event => checkAnswerSimilarQuestion(event, "A")}>{similarMCQ.options.A}</li>
                <li data-answer="B"
                    onClick={event => checkAnswerSimilarQuestion(event, "B")}>{similarMCQ.options.B}</li>
                <li data-answer="C"
                    onClick={event => checkAnswerSimilarQuestion(event, "C")}>{similarMCQ.options.C}</li>
                <li data-answer="D"
                    onClick={event => checkAnswerSimilarQuestion(event, "D")}>{similarMCQ.options.D}</li>
            </ul>
            {/*<div className='buttons'>*/}
            {/*    <button className='next-button' onClick={nextQuestion}>Next</button>*/}
            {/*    <button className='previous-button' onClick={previousQuestion}>Previous</button>*/}
            {/*</div>*/}
            {/*<div className='index'>{index + 1} of {data.length} Questions</div>*/}
            <button className='hint-button' onClick={() => setShowHintModal(true)}>Show Hint</button>

            <Modal show={showHintModal} onClose={() => setShowHintModal(false)}>
                <Hints h={hintsOptions}/>
            </Modal>

        </div>
    );
};

export default SimilarQuestion;