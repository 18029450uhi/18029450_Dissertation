import React from 'react';
import './SimilarQuestion.css';

const SimilarQuestion = ({ similarProblem }) => {
    return (
        <div className='similar-question'>
            <h2>Similar Question</h2>
            <p>{similarProblem.equation}</p>
            <h3>Solution Steps:</h3>
            <ul>
                {similarProblem.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ul>
        </div>
    );
};

export default SimilarQuestion;