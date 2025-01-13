import React from 'react';
import './UserModal.css';
import {useNavigate} from 'react-router-dom';
import {signInWithPopup} from "firebase/auth";
import {provider, auth} from "../../firebase-config";
import {useUser} from "../UserContext";

const UserModal = ({user, correctCount, wrongCount, onClose, onLogout, setUser}) => {
    const {setUserRole} = useUser(); // Get the setUserRole function from UserContext
    const navigate = useNavigate();
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            setUserRole('user'); // Set user role to 'user'
            navigate('/');
        } catch (error) {
            console.error('Error during login:', error);
        }
    };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <div className="modal-content">
                    {!user.uid && <p>Not logged in</p>}

                    {user.email &&
                        <p>Total Correct Answers: {correctCount}</p>

                    }
                    {user.email &&
                        <p>Total Wrong Answers: {wrongCount}</p>
                    }
                    {user.email &&
                        <button className='general' onClick={onLogout}>Logout
                        </button>
                    }

                    {!user.email &&
                        <button type="button" onClick={handleGoogleSignIn} className="btn btn-secondary general">Sign in
                            with Google
                        </button>
                    }
                </div>
            </div>
        </div>
    )
        ;
};

export default UserModal;