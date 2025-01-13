import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Question from "./Components/Question/Question";
import UploadImage from "./Components/UploadQuestion/UploadImage";
import Login from './Components/Auth/Login';
import Logout from './Components/Auth/Logout';
import SignUpIn from './Components/Auth/SignUpIn';

function App() {
    const [questionData, setQuestionData] = useState(null);
    const [user, setUser] = useState(null);

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
                                <Logout setUser={setUser}/>
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