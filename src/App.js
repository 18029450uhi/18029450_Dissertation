import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Question from "./Components/Question/Question";
import Logout from './Components/Auth/Logout';
import SignUpIn from './Components/Auth/SignUpIn';
import ResetButton from './Components/Auth/ResetButton';
import { auth, onAuthStateChanged } from './firebase-config';
import MathSolverUploader from "./Components/Landing/MathSolverUploader";

function App() {
    const [questionData, setQuestionData] = useState(null);
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

    const handleUpload = (data) => {
        setQuestionData(data);
    };

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/signin" element={<SignUpIn setUser={setUser} />} />
                    <Route path="/" element={
                        user ? (
                            <div>
                                <div className="button-position">
                                    <Logout user={user} setUser={setUser} />
                                    <ResetButton setUser={setUser} setQuestionData={setQuestionData} />
                                </div>
                                {questionData ? (
                                    <Question data={questionData} user={user} />
                                ) : (
                                    <MathSolverUploader onUpload={handleUpload} />
                                )}
                            </div>
                        ) : (
                            <SignUpIn setUser={setUser} />
                        )
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;