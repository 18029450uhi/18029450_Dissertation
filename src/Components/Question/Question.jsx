import React, {useEffect, useState, useCallback, useRef} from 'react';
import './Question.css';
import SimilarQuestion from '../SimilarQuestion/SimilarQuestion';
import {handleUpload} from "../../RestUtils/GetFromGemini";
import {schema} from "../../RestUtils/Schemas/SimilarMCQSchema";
import {db} from "../../firebase-config";
import {collection, addDoc} from 'firebase/firestore';

const Question = ({data, user}) => {
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
            const prompt = `Given the following algebra MCQ: ${mcq.question} Generate 4 new, unique algebra MCQs that are conceptually similar but numerically different. Each MCQ should have the same structure and difficulty level as the original. Ensure each new MCQ has one correct answer and three incorrect options.
            *Constraints:*
                * The generated MCQs must be mathematically correct and solvable.
                * The incorrect options should be plausible distractors, not obviously wrong.
                * The level of difficulty should be consistent with the original MCQ.`;
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

    const postToFirestore = async (subject) => {
        try {
            await addDoc(collection(db, "question"), subject);
        } catch (error) {
            console.error('Error posting to Firestore:', error);
        }
    };

    const checkAnswer = (e, answer) => {
        if (!lock) {
            const isCorrect = answer === mcq.correctAnswer;
            const subject = {
                data: {
                    question: mcq.question,
                    isCorrect: isCorrect,
                    email: user.email
                }
            };

            postToFirestore(subject);

            if (isCorrect) {
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
                <hr/>
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
                    <SimilarQuestion q={similarMCQ}/>
                </div>
            )}
        </div>
    );
};

export default Question;