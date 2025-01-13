import React, { useState } from 'react';
import './App.css';
import Question from "./Components/Question/Question";
import UploadImage from "./Components/UploadQuestion/UploadImage";

function App() {
    const [questionData, setQuestionData] = useState(null);

    const handleUpload = (data) => {
        setQuestionData(data);
    };

    return (
        <div>
            {questionData ? (
                <Question data={questionData} />
            ) : (
                <UploadImage onUpload={handleUpload} />
            )}
        </div>
    );
}

export default App;