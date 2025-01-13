import React, { useEffect, useState, useCallback, useRef } from 'react';
import './Question.css';
import SimilarQuestion from '../SimilarQuestion/SimilarQuestion';
import { handleUpload } from "../../RestUtils/GetFromGemini";
import { schema } from "../../RestUtils/Schemas/SimilarMCQSchema";

const Question = ({ data }) => {
    const mcq = JSON.parse(data);
    const [similarMCQ, setSimilarMCQ] = useState(null);
    const [showSimilarQuestionModal, setShowSimilarQuestionModal] = useState(false);
    const [lock, setLock] = useState(false);
    const [similarButtonEnabled, setSimilarButtonEnabled] = useState(false);
    const hasFetchedSimilarMCQ = useRef(false);

    const generateSimilarMCQ = useCallback(async () => {
        if (hasFetchedSimilarMCQ.current) return;
        hasFetchedSimilarMCQ.current = true;

        try {
            const prompt = `Generate a similar MCQ based on this question: ${mcq.question}`;
            const result = await handleUpload(prompt, schema);
            setSimilarMCQ(result.response.text);
            setSimilarButtonEnabled(true);
        } catch (error) {
            console.error('Error:', error);
        }
    }, [mcq]);

    useEffect(() => {
        generateSimilarMCQ();
    }, [generateSimilarMCQ]);

    const checkAnswer = (e, answer) => {
        if (!lock) {
            if (answer === mcq.correctAnswer) {
                e.target.classList.add("correct-answer");
                e.target.classList.remove("incorrect-answer");
            } else {
                e.target.classList.add("incorrect-answer");
                const correctAnswerElement = document.querySelector(`li[data-answer="${mcq.correctAnswer}"]`);
                if (correctAnswerElement) {
                    correctAnswerElement.classList.add("correct-answer");
                    correctAnswerElement.classList.remove("incorrect-answer");
                }
            }
            setLock(true);
        }
    };

    return (
        <div className='container'>
            <div className='question-section'>
                <h1>Question App</h1>
                <hr />
                <div className='content'>
                    <h2 className='question-header'>{mcq.question}</h2>
                    <ul>
                        <li data-answer="A" onClick={event => checkAnswer(event, "A")}>{mcq.options.A}</li>
                        <li data-answer="B" onClick={event => checkAnswer(event, "B")}>{mcq.options.B}</li>
                        <li data-answer="C" onClick={event => checkAnswer(event, "C")}>{mcq.options.C}</li>
                        <li data-answer="D" onClick={event => checkAnswer(event, "D")}>{mcq.options.D}</li>
                    </ul>
                    <button
                        className='similar-question-button'
                        onClick={() => setShowSimilarQuestionModal(!showSimilarQuestionModal)}
                        disabled={!similarButtonEnabled}
                    >
                        Similar Question
                    </button>
                </div>
            </div>
            {similarMCQ && (
                <div className={`similar-question-section ${showSimilarQuestionModal ? 'show' : ''}`}>
                    <SimilarQuestion q={similarMCQ} />
                </div>
            )}
        </div>
    );
};

export default Question;