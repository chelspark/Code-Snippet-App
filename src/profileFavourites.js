import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Card, CardContent, Box, IconButton, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import StarIcon from '@mui/icons-material/Star';
import { yellow } from '@mui/material/colors';
import { ClassNames } from '@emotion/react';
import env from "./env";
const languageMap = {
    javascript: 'javascript',
    python: 'python',
    csharp: 'csharp',  // Add any other languages you need to support
  };

function ProfileFavourites({profile}) {
  const [userProfile, setUserProfile] = useState(profile || {})
  const [favSnippets, setFavSnippets] = useState([])

  useEffect(() => {
      if (profile) {
          setUserProfile(profile || '')
      }
  }, [profile])

  useEffect(() => {
    const fetchFavouriteSnippets = async() => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(env.backend_domain + '/users/profile/favourites', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if(!response.ok) {
          throw new Error('Failed to fetch favourite snippets')
        }

        const data = await response.json();
        console.log('Fetched favourite snippets:', data.favourites)
        setFavSnippets(data.favourites)
      } catch (error) {
        console.error('Error fetching favourite snippets:', error)
      }
    }

    fetchFavouriteSnippets();
  }, [userProfile?.favourites?.length])

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

      setFavSnippets((prevFavSnippets) =>
        prevFavSnippets.filter((snippet) => snippet._id !== snippetId)
      )

    } catch (e) {
      console.error('Internal error updating favourites:', e)
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 3, boxShadow: 3, mt: 4 }} >
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems:"center", position: "relative" }} >
        <Avatar
          sx={{ bgcolor: 'primary.main', width: 70, height: 70, mt: -6 }}
          src={ userProfile?.profileImage ? env.backend_domain + '/users/profile-image/${userProfile.profileImage}' : '' }
        >
          {!userProfile.profileImage && <AccountCircleIcon fontSize="large" />}
        </Avatar>
        <Typography variant="h5" align="center" gutterBottom>
          {userProfile.username || 'Profile'}
        </Typography>

        <Typography variant="h5" align="center" gutterBottom sx={{ mt: 3 }} >
          My favourites
        </Typography>
      </Box>
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={3} mt={2}>
      {favSnippets.length > 0 ? (
        favSnippets.map((snippet, index) => (
          <Card key={index} style={{ flex: '1 1 calc(33% - 20px)', marginBottom: '20px', backgroundColor: 'rgb(30, 30, 30)' }} className="snippet-card">
            <CardContent sx={{ position: 'relative' }} >
              <IconButton onClick={() => handleDeleteFavClick(snippet._id)} sx={{ position: 'absolute', top: 0, right: 0, color: yellow[500]}}>
                <StarIcon />
              </IconButton>
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
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No favourite snippets available.</Typography>
      )}
      </Box>

    </Box>
  )

}

export default ProfileFavourites;