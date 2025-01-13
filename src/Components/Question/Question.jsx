import React, {useState} from 'react';
import './Question.css';
import {data} from '/Users/amir/WebstormProjects/question-app/src/response.js';
import SimilarQuestion from '../SimilarQuestion/SimilarQuestion';
import Hints from '../Hints/Hints';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const renderEquation = (step) => {
    const parts = step.split(':');
    const equation = parts.length > 1 ? parts.slice(1).join(':').trim() : step;
    return {__html: katex.renderToString(equation, {throwOnError: false})};
};
const capitalizeFirstLetter = (text) => {
    return text.replace(/\b\w/g, char => char.toUpperCase());
};
const renderText = (step) => {
    const parts = step.split(':');
    const stepText = parts.slice(0, 1).join(':') + ':';
    return {__html: capitalizeFirstLetter(stepText)};
};
const Question = () => {
    let [index, setIndex] = useState(0);
    let [question, setQuestion] = useState(data[index]);
    let [showHint, setShowHint] = useState(false);
    let [lock, setLock] = useState(false);


    function updateQuestions() {
        setShowHint(false); // Reset hint visibility for the next question
        setLock(false); // Reset lock state for the next question

        // Remove classes from previous question's answers
        const answerElements = document.querySelectorAll('li[data-answer]');
        answerElements.forEach(element => {
            element.classList.remove('correct-answer', 'incorrect-answer');
        });
    }

    const nextQuestion = () => {
        if (index < data.length - 1) {
            setIndex(index + 1);
            setQuestion(data[index + 1]);
            updateQuestions()
        }
    };

    const previousQuestion = () => {
        if (((index < data.length - 1) && index !== 0) || index === data.length - 1) {
            setIndex(index - 1);
            setQuestion(data[index - 1]);
            updateQuestions()
        }
    };


    const toggleHint = () => {
        setShowHint(!showHint);
    };

    // By locking user can select only one answer
    const checkAnswer = (e, answer) => {
        if (lock === false) {
            if (answer === question.mcq.correctAnswer) {
                e.target.classList.add("correct-answer");
            } else {
                e.target.classList.add("incorrect-answer");
                // Highlight the correct answer
                const correctAnswerElement = document.querySelector(`li[data-answer="${question.mcq.correctAnswer}"]`);
                if (correctAnswerElement) {
                    correctAnswerElement.classList.add("correct-answer");
                }
            }
            setLock(true);
        }
    };

    return (
        <div className='container'>
            <h1>Question App</h1>
            <hr/>
            <div className='content'>
                <div className='question-section'>
                    <h2 className='question-header'
                        dangerouslySetInnerHTML={{__html: renderText(question.mcq.question).__html + ' ' + renderEquation(question.mcq.question).__html}}></h2>
                    <ul>
                        <li data-answer="A" onClick={event => checkAnswer(event, "A")}
                            dangerouslySetInnerHTML={renderEquation(question.mcq.options.A)}></li>
                        <li data-answer="B" onClick={event => checkAnswer(event, "B")}
                            dangerouslySetInnerHTML={renderEquation(question.mcq.options.B)}></li>
                        <li data-answer="C" onClick={event => checkAnswer(event, "C")}
                            dangerouslySetInnerHTML={renderEquation(question.mcq.options.C)}></li>
                        <li data-answer="D" onClick={event => checkAnswer(event, "D")}
                            dangerouslySetInnerHTML={renderEquation(question.mcq.options.D)}></li>
                    </ul>
                    <div className='bottons'>
                        <button className='next-button' onClick={nextQuestion}>Next</button>
                        <button className='previous-button' onClick={previousQuestion}>Previous</button>
                    </div>
                    <div className='index'>{index + 1} of {data.length} Questions</div>
                    <button className='hint-button' onClick={toggleHint}>{showHint ? 'Hide Hint' : 'Show Hint'}</button>
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