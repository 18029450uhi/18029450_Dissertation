import React, {useState} from 'react';
import './QuestionsList.css';

const QuestionsList = ({questions, onQuestionSelect}) => {
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);
        onQuestionSelect(question);
    };

    return (
        <div className='question-list'>
            <h3>Questions</h3>
            <ul>
                {questions.map((question, index) => (
                    <li
                        key={index}
                        onClick={() => handleQuestionClick(question)}
                        className={selectedQuestion === question ? 'selected' : ''}
                    >
                        {question.question}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionsList;