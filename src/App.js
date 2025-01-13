import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import {getText, handleUpload} from "./RestUtils/GetFromGemini";
import Question from "./Components/Question/Question";
import QuestionsList from "./Components/QuestionsList/QuestionsList";
import Logout from './Components/Auth/Logout';
import SignUpIn from './Components/Auth/SignUpIn';
import ResetButton from './Components/Auth/ResetButton';
import {auth, onAuthStateChanged} from './firebase-config';
import MathSolverUploader from "./Components/Landing/MathSolverUploader";
import {schema} from "./RestUtils/Schemas/MCQSchema";

function App() {
    const [questionData, setQuestionData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleQuestion = (data, questions) => {
        setQuestions(questions);
        setQuestionData(data);
    };

    const handleQuestionSelect = async (question) => {
        const prompt = `You are a helpful math tutor. Guide the user through the solution step by step. Generate MCQs for the user based on the this ${question.question} question?`;
        const result = await handleUpload(prompt, schema);
        setQuestionData(result.response.text);
    };

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/signin" element={<SignUpIn setUser={setUser}/>}/>
                    <Route path="/" element={
                        user ? (
                            <div>
                                <div className="button-position">
                                    <Logout user={user} setUser={setUser}/>
                                    <ResetButton setUser={setUser} setQuestionData={setQuestionData}/>
                                </div>
                                {questionData ? (
                                    <div className="main-content">
                                        <Question data={questionData} user={user}/>
                                        <QuestionsList questions={questions} onQuestionSelect={handleQuestionSelect}/>
                                    </div>
                                ) : (
                                    <MathSolverUploader onUpload={handleQuestion}/>
                                )}
                            </div>
                        ) : (
                            <SignUpIn setUser={setUser}/>
                        )
                    }/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;