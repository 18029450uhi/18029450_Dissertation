import React, {useState, useEffect} from 'react';
import './Hints.css';
import Modal from "../Modal/Modal";

const Hints = ({h}) => {

    const data = JSON.parse(h);
    const [hintIndex, setHintIndex] = useState(0);
    const [hintOption, setHintOption] = useState(data[hintIndex]);
    const [lock, setLock] = useState(false);
    const [showExplanationModal, setShowExplanationModal] = useState(false);
    const [explanation, setExplanation] = useState('');

    useEffect(() => {
        setHintOption(data[hintIndex]);
    }, [hintIndex, data]);

    const updateQuestions = () => {
        setLock(false);

        const answerElements = document.querySelectorAll('li[data-answer]');
        answerElements.forEach(element => {
            element.classList.remove('correct-answer', 'incorrect-answer');
        });
    };

    const nextQuestion = () => {
        if (hintIndex < data.length - 1) {
            setHintIndex(hintIndex + 1);
            updateQuestions();
        }
    };

    const previousQuestion = () => {
        if (hintIndex > 0) {
            setHintIndex(hintIndex - 1);
            updateQuestions();
        }
    };

    const checkAnswerHintOption = (e, answer, explanation, afterApplyingTheOption) => {
        if (!lock) {
            if (answer === hintOption.correct) {
                e.target.classList.add("correct-answer");
                e.target.classList.remove("incorrect-answer");
            } else {
                e.target.classList.add("incorrect-answer");
                const correctAnswerElement = document.querySelector(`li[data-answer="${hintOption.correct}"]`);
                if (correctAnswerElement) {
                    correctAnswerElement.classList.add("correct-answer");
                    correctAnswerElement.classList.remove("incorrect-answer");
                }
            }
            setExplanation(explanation);
            setShowExplanationModal(true);
            setLock(true);
        }
    };

    return (
        <div className='hints'>
            <h2>Hints</h2>
            <div className='content'>
                <div className='hint-question-section'>
                    <h2 className='question-header'>
                        {hintOption.question}
                    </h2>
                    <ul>
                        {hintOption.options.map((option, index) => (
                            <li key={index} data-answer={index + 1}
                                onClick={event => checkAnswerHintOption(event, index + 1, option.explanation, option.afterApplyingTheOption)}>
                                {option.option}
                            </li>
                        ))}
                    </ul>
                    <div className='hints-toggle-buttons'>
                        <button className='next' onClick={nextQuestion}>Show Next</button>
                        <button className='previous' onClick={previousQuestion}>Show Previous</button>
                    </div>
                    <div className='index'>{hintIndex + 1} of {data.length} Questions</div>
                </div>
            </div>

            <Modal show={showExplanationModal} onClose={() => setShowExplanationModal(false)}>
                <p>{explanation}</p>
            </Modal>
        </div>
    );
};

export default Hints;