// src/theme.js
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#61dafb' }, // Light blue
    secondary: { main: '#bb86fc' }, // Light purple
    background: { default: '#1e1e1e', paper: '#252526' }, // Dark background
    text: { primary: '#ffffff', secondary: '#d4d4d4' }, // Light text colors
  },
});

export default darkTheme;