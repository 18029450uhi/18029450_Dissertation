import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Question from "./Components/Question/Question";
import UploadImage from "./Components/UploadQuestion/UploadImage";
import Logout from './Components/Auth/Logout';
import SignUpIn from './Components/Auth/SignUpIn';
import Reset from './Components/Auth/ResetButton';
import {auth, onAuthStateChanged} from './firebase-config';

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
                    <Route path="/signin" element={<SignUpIn setUser={setUser}/>}/>
                    <Route path="/" element={
                        user ? (
                            <div>
                                <div className="button-position">
                                    <Logout setUser={setUser}/>
                                    <Reset setUser={setUser} setQuestionData={setQuestionData}/>
                                </div>
                                {questionData ? (
                                    <Question data={questionData}/>
                                ) : (
                                    <UploadImage onUpload={handleUpload}/>
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