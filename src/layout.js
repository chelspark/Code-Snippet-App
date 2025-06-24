import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import './styles/styles.css'; // Ensure the correct path

function Layout({ children, title = 'Code Snippet App' }) {
  const navigate = useNavigate();

  // Check if the user is logged in by checking for token in localStorage
  const token = localStorage.getItem('token');  // Check for token

  // Handle logout click
  const handleLogout = () => {
    localStorage.removeItem('token');  // Clear the token from localStorage
    alert('You have been logged out!')
    navigate('/login');  // Redirect to login page after logout
  };

  return (
    <div>
      {/* Navigation Bar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {/* Use Material UI Button with Link component for uniform styling */}
          <Button color="inherit" component={Link} to="/" className="nav-link">
            HOME
          </Button>
          <Button color="inherit" component={Link} to="/snippets" className="nav-link">
            SNIPPETS
          </Button>
          {token ? (
            <>
              {/* Show Profile and Logout buttons when logged in */}
              <Button color="inherit" component={Link} to="/profile" className="nav-link">
                PROFILE
              </Button>
              <Button color="inherit" onClick={handleLogout} className="nav-link">
                LOGOUT
              </Button>
            </>
          ) : (
            <>
              {/* Otherwise, show Login/Register buttons */}
              <Button color="inherit" component={Link} to="/login" className="nav-link">
                LOGIN
              </Button>
              <Button color="inherit" component={Link} to="/register" className="nav-link">
                REGISTER
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container className="main-container" maxWidth="lg">
        {children}
      </Container>

      {/* Footer */}
      <footer className="footer">
        <Typography variant="body2" color="textSecondary" align="center">
          &copy; 2024 Code Snippet App
        </Typography>
      </footer>
    </div>
  );
}

export default Layout;
