import React, {useState, useEffect} from 'react';
import {auth, signOut} from '../../firebase-config';
import UserModal from '../Modal/UserModal';
import {collection, query, where, getDocs} from 'firebase/firestore';
import {db} from '../../firebase-config';

const Logout = ({user, setUser}) => {
    const [showModal, setShowModal] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const q = query(collection(db, "question"), where("data.email", "==", user.email));
            const querySnapshot = await getDocs(q);
            let correct = 0;
            let wrong = 0;
            querySnapshot.forEach((doc) => {
                if (doc.data().data.email === user.email) {
                    console.log(doc.data().data)
                    console.log(user.email)
                    if (doc.data().data.isCorrect) {
                        correct++;
                    } else {
                        wrong++;
                    }
                }
            });
            setCorrectCount(correct);
            setWrongCount(wrong);
        };

        fetchData();
    }, [user.email]);

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
            <button onClick={() => setShowModal(true)}>{user.displayName}</button>
            {showModal && (
                <UserModal
                    correctCount={correctCount}
                    wrongCount={wrongCount}
                    onClose={() => setShowModal(false)}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
};

export default Logout;