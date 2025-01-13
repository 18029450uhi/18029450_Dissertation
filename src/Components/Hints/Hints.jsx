import React, {useState} from 'react';
import './Hints.css';

const Hints = ({steps}) => {
    const [hintIndex, setHintIndex] = useState(0);

    const showNextHint = () => {
        if (hintIndex < steps.length - 1) {
            setHintIndex(hintIndex + 1);
        }
    };

    return (
        <div className='hints'>
            <h2>Hints</h2>
            <button onClick={showNextHint}>Show Next</button>
            <ul>
                {steps.slice(0, hintIndex + 1).map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ul>
        </div>
    );
};

export default Hints;