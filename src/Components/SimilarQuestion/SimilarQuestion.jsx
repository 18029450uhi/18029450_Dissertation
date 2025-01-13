import React from 'react';
import './SimilarQuestion.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const renderEquation = (step) => {
    const parts = step.split(':');
    const equation = parts.length > 2 ? parts.slice(2).join(':').trim() : step;
    return {__html: katex.renderToString(equation, {throwOnError: false})};
};
const renderText = (step) => {
    const parts = step.split(':');
    const stepText = parts.slice(0, 2).join(':') + ':';
    return { __html: stepText };
};

const SimilarQuestion = ({similarProblem}) => {
    return (
        <div className='similar-question'>
            <h2>Similar Question</h2>
            <p dangerouslySetInnerHTML={renderEquation(similarProblem.equation)}></p>
            <h3>Solution Steps:</h3>
            <ul>
                {similarProblem.steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <li className='item-text' key={index} dangerouslySetInnerHTML={renderText(step)}></li>
                        <li className='item-equation' dangerouslySetInnerHTML={renderEquation(step)}></li>
                    </React.Fragment>
                ))}
            </ul>
        </div>
    );
};

export default SimilarQuestion;