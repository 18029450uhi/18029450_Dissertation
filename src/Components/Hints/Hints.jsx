import React, {useState, useEffect} from 'react';
import './Hints.css';
import Modal from "../Modal/Modal";

const Hints = ({h, x}) => {
    const data = JSON.parse(h);
    const [hintIndex, setHintIndex] = useState(0);
    const [hintOption, setHintOption] = useState(data[hintIndex]);
    const [showExplanationModal, setShowExplanationModal] = useState(false);
    const [explanation, setExplanation] = useState('');

    useEffect(() => {
        const hintsMap = JSON.parse(localStorage.getItem("hintsMap")) || {};
        hintsMap[x] = h; // Store the key-value pair
        localStorage.setItem("hintsMap", JSON.stringify(hintsMap));
    }, [x, h]);


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
        if (answer === hintOption.correctAnswer.answer) {
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
                        <li data-answer="A"
                            onClick={event => checkAnswerHintOption(event, "A", hintOption.options.A.explanation)}>{hintOption.options.A.option}</li>
                        <li data-answer="B"
                            onClick={event => checkAnswerHintOption(event, "B", hintOption.options.B.explanation)}>{hintOption.options.B.option}</li>
                        <li data-answer="C"
                            onClick={event => checkAnswerHintOption(event, "C", hintOption.options.C.explanation)}>{hintOption.options.C.option}</li>
                        <li data-answer="D"
                            onClick={event => checkAnswerHintOption(event, "D", hintOption.options.D.explanation)}>{hintOption.options.D.option}</li>
                    </ul>
                    <div className='hints-dots'>
                        {data.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === hintIndex ? 'active' : ''}`}
                                onClick={() => {
                                    clearCheckedMarks();
                                    setHintIndex(index);
                                    const hintIndexes = JSON.parse(localStorage.getItem("hintIndexes")) || {};
                                    hintIndexes[x] = Math.max(index + 1, index || 0); // Store the key-value pair
                                    localStorage.setItem("hintIndexes", JSON.stringify(hintIndexes));
                                }}
                            ></span>
                        ))}
                    </div>
                    <div className='index'>{hintIndex + 1} of {data.length} Questions
                    </div>
                </div>
            </div>

            {/*{hintIndex === data.length - 1 && <DataBypass q={hintSteps}/>}*/}

            <Modal show={showExplanationModal} onClose={() => setShowExplanationModal(false)}>
                <p>{explanation}</p>
            </Modal>
        </div>
    );
};

export default Hints;