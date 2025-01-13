import React, {useState} from 'react';
import './Hints.css';
import katex from "katex";

const renderEquation = (step) => {
    const parts = step.split(':');
    const equation = parts.length > 2 ? parts.slice(2).join(':').trim() : step;
    return {__html: katex.renderToString(equation, {throwOnError: false})};
};
const renderText = (step) => {
    const parts = step.split(':');
    const stepText = parts.slice(0, 2).join(':') + ':';
    return {__html: stepText};
};
const Hints = ({steps}) => {
    const [hintIndex, setHintIndex] = useState(0);

    const showNextHint = () => {
        if (hintIndex < steps.length - 1) {
            setHintIndex(hintIndex + 1);
        }
    };
    const showPreviousHint = () => {
        if ((hintIndex < steps.length - 1 && hintIndex !== 0) || hintIndex === steps.length - 1) {
            setHintIndex(hintIndex - 1);
        }
    };

    return (
        <div className='hints'>
            <h2>Hints</h2>
            <button className='show-next-button' onClick={showNextHint}>Show Next</button>
            <button className='show-next-button' onClick={showPreviousHint}>Show Previous</button>
            <ul>
                {steps.slice(0, hintIndex + 1).map((step, index) => (
                    <li key={index}
                        dangerouslySetInnerHTML={{__html: renderText(step).__html + ' ' + renderEquation(step).__html}}></li>
                ))}
            </ul>
        </div>
    );
};

export default Hints;