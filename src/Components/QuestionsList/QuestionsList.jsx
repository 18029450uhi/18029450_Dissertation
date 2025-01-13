import React from 'react';
import './QuestionsList.css';

const QuestionsList = ({questions, onQuestionSelect}) => {
    return (
        <div className='question-list'>
            <h3>Questions</h3>
            <ul>
                {questions.map((question, index) => (
                    <li key={index} onClick={() => onQuestionSelect(question)}>
                        {question.question}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionsList;