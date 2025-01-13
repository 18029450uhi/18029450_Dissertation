import React, {useState} from 'react';
import './Question.css';
import {data} from '/Users/amir/WebstormProjects/question-app/src/response.js';
import SimilarQuestion from '../SimilarQuestion/SimilarQuestion';
import Hints from '../Hints/Hints';

const Question = () => {
    let [index, setIndex] = useState(0);
    let [question, setQuestion] = useState(data[index]);
    let [showHint, setShowHint] = useState(false);

    const nextQuestion = () => {
        if (index < data.length - 1) {
            setIndex(index + 1);
            setQuestion(data[index + 1]);
            setShowHint(false); // Reset hint visibility for the next question
        }
    };

    const toggleHint = () => {
        setShowHint(!showHint);
    };

    return (
        <div className='container'>
            <h1>Question App</h1>
            <hr/>
            <div className='content'>
                <div className='question-section'>
                    <h2>{question.mcq.question}</h2>
                    <ul>
                        <li>{question.mcq.options.A}</li>
                        <li>{question.mcq.options.B}</li>
                        <li>{question.mcq.options.C}</li>
                        <li>{question.mcq.options.D}</li>
                    </ul>
                    <button onClick={nextQuestion}>Next</button>
                    <div className='index'>{index + 1} of {data.length} Questions</div>
                    <button onClick={toggleHint}>Show Hint</button>
                    {showHint && <Hints steps={question.originalProblem.steps}/>}
                </div>
                <div className='similar-question-section'>
                    <SimilarQuestion similarProblem={question.similarProblem}/>
                </div>
            </div>
        </div>
    );
};

export default Question;