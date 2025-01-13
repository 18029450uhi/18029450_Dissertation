import React, {useState, useEffect} from 'react';
import {ref, query, orderByChild, equalTo, get} from "firebase/database";

import {auth, signOut} from '../../firebase-config';
import UserModal from '../Modal/UserModal';
// import {collection, query, where, getDocs} from 'firebase/firestore';
import {db} from '../../firebase-config';
import './Auth.css'

const Logout = ({user, setUser}) => {
    const [showModal, setShowModal] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            if (!user.uid) return;
            if (!user.email) return;
            const questionRef = query(ref(db, `questions/${user.uid}`), orderByChild("email"), equalTo(user.email));
            const snapshot = await get(questionRef);
            let correct = 0;
            let wrong = 0;
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                if (data.isCorrect) {
                    correct++;
                } else {
                    wrong++;
                }
            });
            setCorrectCount(correct);
            setWrongCount(wrong);
        };

        if (user) {
            fetchData().then(() => console.log('Score fetched'));
        }
    }, [showModal]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div>
            <button className='general' onClick={() => setShowModal(true)}>{user.displayName}</button>
            {showModal && (
                <UserModal
                    user={user}
                    correctCount={correctCount}
                    wrongCount={wrongCount}
                    onClose={() => setShowModal(false)}
                    onLogout={handleLogout}
                    setUser={setUser}
                />
            )}
        </div>
    );
};

export default Logout;