import React from 'react';
import {useNavigate} from 'react-router-dom';
import './Auth.css'
function ResetButton({setUser, setQuestionData}) {
    const navigate = useNavigate();

    const handleReset = async () => {
        try {
            setQuestionData(null);
            navigate('/');
        } catch (error) {
            console.error('Error during reset:', error);
        }
    };

    return (
        <div>
            <button className='general' onClick={handleReset}>Reset</button>
        </div>
    );
}

export default ResetButton;