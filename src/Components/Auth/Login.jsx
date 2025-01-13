import React from 'react';
import { auth, provider, signInWithPopup } from '../../firebase-config';

const Login = ({ setUser }) => {
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div>
            <button onClick={handleLogin}>Login with Google</button>
        </div>
    );
};

export default Login;