import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import darkTheme from './styles/theme'; // Import the custom dark theme

import Home from './home'; // Make sure the file name matches
import Snippets from './snippets';
import Login from './login'; // Import the new Login component
import Register from './register'; // Import the Register component
import Profile from './profile'; // Import the Profile component
import Layout from './layout';
import TestCodeMirror from './TestCodeMirror';
import PrivateRoute from './PrivateRoute';
import ProfileEdit from './profileEdit';
import PublicProfile from './publicProfile';
import NotFound from './NotFound';
import AuthGuard from './AuthGuard';
import ProfileFavourites from './profileFavourites'
import env from "./env";

function App() {
  const [snippets, setSnippets] = useState([]);
  const [profile, setProfile] = useState(null);

  // Fetch snippets when the component mounts
  useEffect(() => {
    // fetch('http://localhost:3000/api/snippets', { credentials: 'include'})
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok')
    //     }
    //     return response.json()
    //   })
    //   .then((data) => setSnippets(data.snippets))
    //   .catch((error) => console.error('Error fetching snippets:', error))

    // Fetch user profile, including the token in Authorization header
    const token = localStorage.getItem('token');
    fetch (env.backend_domain + '/users/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,  // Add the token in Authorization header
      'Content-Type': 'application/json',
    }
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then((data) => {
        console.log('response not ok')
        throw new Error(data.error)
      })
    }
    return response.json()
  })
  .then(data => {
    if(data.success) {
      setProfile(data.profile)
    } else {
      console.log("failed to fetch profile")
      throw new Error("no profile")
    }
  })
  .catch(err => console.log('Internal Error fetching profile'))

  }, [profile]);

  const onUpdateProfile = (updatedProfile) => {
    setProfile(updatedProfile) // Update profile state with the new data
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Ensures dark theme background */}
        <Router>
          <Layout>
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<Home profile={profile} />} />
              <Route path="/snippets" element={
                <PrivateRoute>
                  <Snippets snippets={snippets} />
                </PrivateRoute>
                } />
              <Route path="/login" element={
                <AuthGuard>
                  <Login onUpdateProfile={onUpdateProfile} />
                </AuthGuard>
                } />
              <Route path="/register" element={
                <AuthGuard>
                  <Register />
                </AuthGuard>
                } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile profile={profile} />
                </PrivateRoute>
                } />
              <Route path="/test" element={<TestCodeMirror/>} />  {/* Add a route for testing */}
              <Route path="/profileEdit"element={
                <PrivateRoute>
                  <ProfileEdit profile={profile} onUpdateProfile={onUpdateProfile}/>
                </PrivateRoute>
                } />
              <Route path="/users/:id/profile" element={<PublicProfile />} />
              <Route path="/profile/favourites" element={
                <PrivateRoute>
                  <ProfileFavourites profile={profile} />
                </PrivateRoute>
                } />
            </Routes>
          </Layout>
        </Router>
        </ThemeProvider>
  );
}

export default App;
