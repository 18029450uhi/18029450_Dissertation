import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {auth, provider, signInWithPopup, signOut} from '../../firebase-config';
import {useUser} from '../UserContext'; // Import the UserContext
import './Auth.css';

function SignUpIn({setUser}) {
    const [signUp, setSignUp] = useState(false);
    const navigate = useNavigate();
    const {setUserRole} = useUser(); // Get the setUserRole function from UserContext

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

    const handleGuestSignIn = () => {
        const guestUser = {
            displayName: 'Guest User',
            email: null,
            isGuest: true, // Indicate this is a guest user
        };

        setUser(guestUser); // Set the guest user in context
        setUserRole('guest'); // Assign the guest role
        navigate('/'); // Navigate to the main page
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
            <div>
                <div className="mb-4">
                    {!signUp ? <h1 className="text-center">Sign in</h1> : <h1 className="text-center">Sign up</h1>}
                </div>
                <div className="d-grid gap-2">
                    <button type="button" onClick={handleGoogleSignIn} className="btn btn-secondary general">Sign in
                        with Google
                    </button>
                    <button type="button" onClick={handleGuestSignIn} className="btn btn-secondary general">Continue as
                        Guest
                    </button>
                </div>
                <div className="row mt-3">
                    <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input readOnly onClick={() => setSignUp(false)} type="radio" className="btn-check"
                               name="btnradio" id="btnradio1" autoComplete="off" checked={!signUp}/>
                        <label className="btn btn-outline-primary" htmlFor="btnradio1">Sign in</label>
                        <input readOnly onClick={() => setSignUp(true)} type="radio" className="btn-check"
                               name="btnradio" id="btnradio2" autoComplete="off" checked={signUp}/>
                        <label className="btn btn-outline-primary" htmlFor="btnradio2">Sign up</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpIn;