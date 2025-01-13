import React, {useEffect, useState} from 'react';
import './PreviousQuestionsList.css';
import {equalTo, get, orderByChild, query, ref} from "firebase/database";
import {db} from "../../firebase-config";

const PreviousQuestionsList = ({user}) => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (!user?.uid || !user.email) return;

        const fetchQuestions = async () => {
            try {
                const questionRef = query(
                    ref(db, `questions/${user.uid}`),
                    orderByChild("email"),
                    equalTo(user.email)
                );

                const snapshot = await get(questionRef);
                const fetchedQuestions = [];

                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    if (data?.question) fetchedQuestions.push(data.question);
                });

                setQuestions(fetchedQuestions);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [user?.uid, user.email]);

    return (
        <div className="question-list">
            <h3>Previously Solved Questions</h3>
            <ul>
                {questions.length > 0 ? (
                    questions.map((question, index) => (
                        <li key={index}>{question}</li>
                    ))
                ) : (
                    <li>No previous questions found.</li>
                )}
            </ul>
        </div>
    );
};

export default PreviousQuestionsList;
