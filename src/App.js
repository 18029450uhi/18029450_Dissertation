import React, { useState } from 'react';
import './App.css';
import Question from "./Components/Question/Question";
import UploadImage from "./Components/UploadQuestion/UploadImage";
import Login from './Components/Auth/Login';
import Logout from './Components/Auth/Logout';

function App() {
    const [questionData, setQuestionData] = useState(null);
    const [user, setUser] = useState(null);

    const handleUpload = (data) => {
        setQuestionData(data);
    };

    return (
        <div>
            {user ? (
                <div>
                    <Logout setUser={setUser} />
                    {questionData ? (
                        <Question data={questionData} />
                    ) : (
                        <UploadImage onUpload={handleUpload} />
                    )}
                </div>
            ) : (
                <Login setUser={setUser} />
            )}
        </div>
    );
}

export default App;