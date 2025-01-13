import React, {useState, useEffect} from 'react';
import './Hints.css';
import Modal from "../Modal/Modal";

const Hints = ({h}) => {
    const data = JSON.parse(h);
    console.log(data)
    const [hintIndex, setHintIndex] = useState(0);
    const [hintOption, setHintOption] = useState(data[hintIndex]);
    const [showExplanationModal, setShowExplanationModal] = useState(false);
    const [explanation, setExplanation] = useState('');

    useEffect(() => {
        setHintOption(data[hintIndex]);
    }, [hintIndex, data]);
    const clearCheckedMarks = () => {
        const answerElements = document.querySelectorAll('li[data-answer]');
        answerElements.forEach(element => {
            element.classList.remove('correct-answer', 'incorrect-answer');
        });
    };


    const checkAnswerHintOption = (e, answer, explanation, afterApplyingTheOption) => {
        if (answer === hintOption.correct) {
            e.target.classList.add("correct-answer");
            setExplanation(explanation);
            setShowExplanationModal(true);
            setTimeout(() => {
                setShowExplanationModal(false);
                if (hintIndex < data.length - 1) {
                    setHintIndex(hintIndex + 1);
                }
                clearCheckedMarks();
            }, 1000);
        } else {
            e.target.classList.add("incorrect-answer");
            setExplanation(explanation);
            setShowExplanationModal(true);
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
                    <div className='hints-dots'>
                        {data.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === hintIndex ? 'active' : ''}`}
                                onClick={() => {
                                    clearCheckedMarks();
                                    setHintIndex(index);
                                }}
                            ></span>
                        ))}
                    </div>
                    <div className='index'>{hintIndex + 1} of {data.length} Questions
                    </div>
                </div>
            </div>

            <Modal show={showExplanationModal} onClose={() => setShowExplanationModal(false)}>
                <p>{explanation}</p>
            </Modal>
        </div>
    );
};

export default Hints;