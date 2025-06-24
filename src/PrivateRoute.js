import React from "react";
import { Navigate } from 'react-router-dom';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
    // Check if the JWT token is stored in localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        // If no token is found, redirect to login
        return <Navigate to='/login?error=loginRequired' />;
    }

    // Optionally, decode and check token expiration (if implemented)
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const isExpired = decodedToken.exp * 1000 < Date.now();
        
        if (isExpired) {
            // Token is expired, redirect to login with error
            localStorage.removeItem('token');  // Clear the expired token
            return <Navigate to='/login?error=tokenExpired' />;
        }
    } catch (e) {
        // If token is invalid or decoding fails, redirect to login
        localStorage.removeItem('token');
        return <Navigate to='/login?error=invalidToken' />;
    }

    // If token is valid, render the protected children
    return children;
};

export default PrivateRoute;
