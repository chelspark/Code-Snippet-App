import React from "react";
import { Navigate } from 'react-router-dom';

// AuthGuard component to redirct authenticated users from login/register pages to profile page.
const AuthGuard = ({ children }) => {
    // Check if the JWT token is stored in localStorage
    const token = localStorage.getItem('token');

    
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const isExpired = decodedToken.exp * 1000 < Date.now();

        if( !token || isExpired) {
            if(isExpired) {
                localStorage.removeItem('token');
            }
            return children
        }


    } catch (e) {
        localStorage.removeItem('token');
        return children
    }
    
    return <Navigate to='/profile' />

}

export default AuthGuard;