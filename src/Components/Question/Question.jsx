import React, {useState, useCallback, useRef, useEffect} from 'react';
import {ref, set, push} from "firebase/database";

import './Question.css';
import SimilarQuestion from '../SimilarQuestion/SimilarQuestion';
import ResultModal from '../Modal/ResultModal';
import {handleUpload, getVerifyAnswer} from "../../RestUtils/GetFromGemini";
import {schema as similarMCQSchema} from "../../RestUtils/Schemas/SimilarMCQSchema";
import {schema as verifyAnswerSchema} from "../../RestUtils/Schemas/VarifyAnswerSchema";
import {db} from "../../firebase-config";

const Question = ({data, user}) => {
    const mcq = JSON.parse(data);
    const [similarMCQ, setSimilarMCQ] = useState(null);
    const [showSimilarQuestionModal, setShowSimilarQuestionModal] = useState(false);
    const [similarButtonEnabled, setSimilarButtonEnabled] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
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
            const result = await handleUpload(prompt, similarMCQSchema);
            setSimilarMCQ(result.response.text);
            setSimilarButtonEnabled(true);
        } catch (error) {
            console.error('Error:', error);
        }
    }, [mcq]);

    useEffect(() => {
        generateSimilarMCQ();
    }, [generateSimilarMCQ]);

    /**
     * Posts the question data to Realtime Database.
     * @param {boolean} isCorrect - Indicates if the answer is correct.
     */
    async function postToRealtimeDatabase(isCorrect) {
        const subject = {
            question: mcq.question,
            isCorrect: isCorrect,
            email: user.email
        };
        console.log('Subject:', subject);
        try {
            const questionRef = ref(db, 'questions/' + user.uid);
            const newQuestionRef = push(questionRef);
            await set(newQuestionRef, subject);
            console.log('Successfully posted to Realtime Database:', subject);
        } catch (error) {
            console.error('Error posting to Realtime Database:', error);
        }
    }


    const handleImageUpload = async (event) => {
        setResultMessage('');
        const file = event.target.files[0];
        if (file) {
            try {
                const prompt = "Verify the answer";
                const result = await getVerifyAnswer(file, prompt, verifyAnswerSchema);
                const isCorrect = JSON.parse(result).isCorrect;
                setResultMessage(isCorrect ? 'Congratulations! You have done it.' : 'You got it wrong.');
                setShowResultModal(true);
                await postToRealtimeDatabase(isCorrect);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };


    return (
        <div className='container'>
            <div className='question-section'>
                <h1>Question App</h1>
                <hr/>
                <div className='content'>
                    <h2 className='question-header'>{mcq.question}</h2>
                    <div className='content-button'>
                        <button
                            className='similar-question-button'
                            onClick={() => setShowSimilarQuestionModal(!showSimilarQuestionModal)}
                            disabled={!similarButtonEnabled}
                        >
                            Similar Question
                        </button>
                        <input className='upload-answer' type="file" accept="image/*" onChange={handleImageUpload}/>
                    </div>
                </div>
            </div>
            {similarMCQ && (
                <div className={`similar-question-section ${showSimilarQuestionModal ? 'show' : ''}`}>
                    <SimilarQuestion q={similarMCQ}/>
                </div>
            )}
            <ResultModal
                show={showResultModal}
                message={resultMessage}
                onClose={() => setShowResultModal(false)}
            />
        </div>
    );
};

export default Question;