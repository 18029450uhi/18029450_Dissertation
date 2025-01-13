import React from 'react';
import { useUser } from './UserContext';

const GetScore = () => {
    const { userRole } = useUser();

    if (userRole === 'guest') {
        return <div>Access to score is restricted for guest users.</div>;
    }

    return <div>Your score is: 100</div>;
};

export default GetScore;