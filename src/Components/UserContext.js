import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const value = {
        user,
        setUser,
        userRole,
        setUserRole,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
