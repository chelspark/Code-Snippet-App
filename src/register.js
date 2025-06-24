import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, FormControl, FormHelperText } from '@mui/material';
import env from "./env";

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must meet the security requirements.');
      return;
    }

    try {
      const response = await fetch(env.backend_domain + '/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! You can now log in.');
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Internal server error occurred');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Register
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Username"
            type="text"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />
          {/* Password field with bullet list helper text */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password && ( // Show helper text as bullet list when the user starts typing in the password field
              <FormHelperText component="div" sx={{ color: 'white', fontSize: '1rem', mt: 1 }}>
              <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc' }}>
                <li>At least 8 characters long</li>
                <li>Includes an uppercase letter</li>
                <li>Includes a lowercase letter</li>
                <li>Includes a number</li>
                <li>Includes a special character (e.g., @$!%*?&)</li>
              </ul>
            </FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Register;
