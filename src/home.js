import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent
} from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { yellow } from '@mui/material/colors';
import env from "./env";

const languageMap = {
  javascript: 'javascript',
  python: 'python',
  csharp: 'csharp',
};

function Home({profile}) {
  const [publicSnippets, setPublicSnippets] = useState([]);
  const [userProfile, setUserProfile] = useState(profile || {});
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  useEffect(() => {
    if (profile) {
        setUserProfile(profile || '')
    }
  }, [profile])

  useEffect(() => {
    const fetchPublicSnippets = async () => {
      try {
        const response = await fetch(env.backend_domain + '/api/public-snippets?' + new URLSearchParams({
          filter: filter
      }), {
          method: 'GET',

      });
        if (!response.ok) {
          throw new Error('Failed to fetch public snippets');
        }
        const data = await response.json();
        console.log('Fetched Snippets:', data);
        setPublicSnippets(data);
      } catch (error) {
        console.error('Error fetching snippets:', error);
      }
    };

    fetchPublicSnippets();
  }, [filter]);

  const filterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleAddFavClick = async (snippetId) => {
    console.log('snipped id:', snippetId)
    const token = localStorage.getItem('token');
    try {
      const response = await fetch (env.backend_domain + '/users/add-favourites', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favourites: snippetId })
      })

      if(!response.ok) {
        throw new Error('Failed to update favourites')
      }

      const data = await response.json()
      console.log('Added to favourites! updated:', data.user)
    } catch (e) {
      console.error('Error updating favourites:', e)
    }
  }

  const handleDeleteFavClick = async(snippetId) => {
    console.log('snipped id:', snippetId)
    const token = localStorage.getItem('token');
    try {
      const response = await fetch (env.backend_domain + '/users/delete-favourites', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favourites: snippetId })
      })

      if(!response.ok) {
        throw new Error('Failed to update favourites')
      }

      const data = await response.json()
      console.log('Deleted from favourites! updated:', data.user)
    } catch (e) {
      console.error('Internal error updating favourites:', e)
    }
  }

  return (
    <Container maxWidth={false} style={{ marginTop: '50px', paddingLeft: '24px', paddingRight: '24px' }}>
      <Typography variant="h2" gutterBottom textAlign="center">
        Welcome to the Code Snippet App
      </Typography>
      <Typography variant="body1" paragraph textAlign="center">
        Browse public code snippets below:
      </Typography>

        {/* Language filter */}
        <Box textAlign="center" marginBottom={3}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter}
            label="Language"
            onChange={filterChange}
            displayEmpty
            style={{ minWidth: '200px', maxWidth: '300px', width: '50%' }} // Adjust width as needed
          >
            <MenuItem value={""}>None</MenuItem>
            <MenuItem value={"python"}>Python</MenuItem>
            <MenuItem value={"javascript"}>JavaScript</MenuItem>
            <MenuItem value={"csharp"}>C#</MenuItem>
          </Select>
        </Box>
      
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={3}>
        {publicSnippets.length > 0 ? (
          publicSnippets.map((snippet, index) => (
            <div key={index} className="snippet-card">
              {userProfile.id && (
                  <>
                  {userProfile.favourites.includes(snippet._id) ? (
                    <IconButton onClick={() => handleDeleteFavClick(snippet._id)} sx={{ position: 'absolute', top: 0, right: 0, color: yellow[500]}}>
                      <StarIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleAddFavClick(snippet._id)} sx={{ position: 'absolute', top: 0, right: 0, color: 'grey' }}>
                      <StarBorderIcon />
                    </IconButton>
                  )}
                  </>
                )}
              <Typography variant="h5" component="div">
                {snippet.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic', margin: '5px 0' }}>
                Language: {snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {snippet.description}
              </Typography>
              <SyntaxHighlighter
                language={languageMap[snippet.language] || 'plaintext'}
                style={dracula}
                showLineNumbers
              >
                {snippet.fulltext}
              </SyntaxHighlighter>
            </div>
          ))
        ) : (
          <Typography>No public snippets available.</Typography>
        )}
      </Box>

      <Box textAlign="center" marginTop={4}>
        <Button variant="contained" color="primary" size="large" onClick={handleGetStarted}>
          Get Started
        </Button>
      </Box>
    </Container>
  );
}

export default Home;