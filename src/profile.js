import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Avatar, Button, FormControlLabel, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation, useNavigate } from 'react-router-dom';
import AntSwitch from './styles/customSwitch';
import GitHubIcon from '@mui/icons-material/GitHub';
import { EmailIcon, LinkedinIcon, XIcon } from 'react-share';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StarIcon from '@mui/icons-material/Star';
import { yellow } from '@mui/material/colors';
import env from "./env";

function Profile({profile}) {
  const [userProfile, setUserProfile] = useState(profile || {});
  const [profileVisibility, setProfileVisibility] = useState(profile?.profileVisibility || 'private')
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
        setUserProfile(profile || '')
        setProfileVisibility(profile.profileVisibility || 'private')
    }
}, [profile])


useEffect(() => {
  if (profileVisibility === 'public') {
    setError('')
  }
}, [profileVisibility])


if (!profile) {
  return (
    <Container maxWidth="sm">
      <Typography variant="body1" align="center">
        Loading profile...
      </Typography>
    </Container>
  );
}

  const handleProfileEdit = () => {
    // console.log('Clicked on Edit button')
    navigate(`/profileEdit`)
  }

  const handleVisibilityChange = async (e) => {
    const newVisibility = e.target.checked ? 'public' : 'private';
    console.log('new Visibility', newVisibility)

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(env.backend_domain + '/users/profile-visibility', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visibility: newVisibility })
      })

      const data = await response.json()
      if(!response.ok) {
        setError('Failed to update profile visibility', data.error)
      }else {
        console.log('Profile visibility updated:', data.visibility)
      }

    } catch (error) {
      console.error('Error updating profile visibility:', error)
      setError('Internal server error')
    }
  }

  const handleShareProfile = () => {
    if (profileVisibility !== 'public') {
      setError('Profile is private. Set it to public to share.')
      return;
    }

    const shareUrl = `${window.location.origin}/users/${profile.id}/profile`
    navigator.clipboard.writeText(shareUrl).then(() => {alert('Profile URL copied to clipboard!')})

  }

  const handleFavClick = () => {
    // console.log('clicked!')
    navigate(`/profile/favourites`)
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" position="relative">
          <FormControlLabel
            control={
              <AntSwitch
                checked={profileVisibility === 'public'}
                onChange={handleVisibilityChange}
                sx={{ mr: 1}}
              />
            }
            label="Public"
            sx={{ position: 'absolute', top: 0, right: 0}}
          />
          <Avatar
            sx={{ bgcolor: 'primary.main', width: 70, height: 70, mt: -6 }}
            src={ userProfile?.profileImage ? env.backend_domain + '/users/profile-image/${userProfile.profileImage}' : '' }
          >
            {!userProfile.profileImage && <AccountCircleIcon fontSize="large" />}
            {/* <AccountCircleIcon fontSize="large" /> */}
          </Avatar>
        </Box>
        <Typography variant="h5" align="center" gutterBottom>
          {userProfile.username || 'Profile'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", mb: 2 }} >
            <Box sx={{  }} >
              <IconButton onClick={() => handleFavClick()} sx={{ mb: -1 }} >
                <StarIcon sx={{ color: yellow[500], width: '50px', height: '50px' }} />
              </IconButton>
              <Typography align='center' >{userProfile?.favourites?.length}</Typography>
            </Box>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" position="relative" sx={{ mb: 5, gap: 1 }} >
          <Button
              variant="contained"
              // size="small"
              // startIcon={<EditIcon sx={{ mr: -0.7, fontSize: 5 }} />}
              sx={{ textTransform:'none', minWidth: '100px', fontSize: '0.7rem', padding: '5px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => navigate('/profileEdit')}
            >
              <EditIcon sx={{ fontSize: 16, mr: '2px' }} /> Edit Profile

            </Button>
            <Button
              variant='outlined'
              // startIcon={<ShareIcon sx={{ fontSize: 2 }} />}
              sx={{ textTransform:'none', minWidth: '40px', padding: '5px 0px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              onClick={handleShareProfile}
            >
              <ShareIcon sx={{ fontSize: 18 }} />
            </Button>
        </Box>
        {error && (
            <Typography variant="body2" color="error" align="center" sx={{ mt: -3 }}>
              {error}
            </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1"><strong>Email:</strong> {userProfile.email}</Typography>
          <Typography variant="body1"><strong>Username:</strong> {userProfile.username}</Typography>
        </Box>
        <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 ,mt: 1}} > 
          {profile.github && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-start' }} >
                <GitHubIcon sx={{ fontSize: 29, color: 'black' }}/>
                <ArrowForwardIosIcon sx={{ fontSize: 18, mr: '2px', ml: '2px' }} /> 
                <Box sx={{ fontSize: 13, width: '450px' }} >
                  <a 
                    href={profile.github}
                    target='_blank'
                    style={{ textDecoration: 'none', color: 'inherit'}}
                  >
                    {profile.github}
                  </a>
                </Box>
              </Box>
          )}
          {profile.socialEmail && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-start' }} >
              <EmailIcon size={30} round={true} />
              <ArrowForwardIosIcon sx={{ fontSize: 18, mr: '2px', ml: '2px' }} /> 
              <Box sx={{ fontSize: 13, width: '450px' }} >
                <a 
                  href={profile.socialEmail}
                  target='_blank'
                  style={{ textDecoration: 'none', color: 'inherit'}}
                >
                  {profile.socialEmail}
                </a>
              </Box>
            </Box>
          )}
          {profile.linkedin && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-start' }} >
              <LinkedinIcon size={30} round={true} />
              <ArrowForwardIosIcon sx={{ fontSize: 18, mr: '2px', ml: '2px' }} /> 
              <Box sx={{ fontSize: 13, width: '450px' }} >
                <a 
                  href={profile.linkedin}
                  target='_blank'
                  style={{ textDecoration: 'none', color: 'inherit'}}
                >
                  {profile.linkedin}
                </a>
              </Box>
            </Box>
          )}
          {profile.twitter && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-start' }} >
              <XIcon size={30} round={true} />
              <ArrowForwardIosIcon sx={{ fontSize: 18, mr: '2px', ml: '2px' }} /> 
              <Box sx={{ fontSize: 13, width: '450px' }} >
                <a 
                  href={profile.twitter}
                  target='_blank'
                  style={{ textDecoration: 'none', color: 'inherit'}}
                >
                  {profile.twitter}
                </a>
              </Box>
            </Box>
          )}
          
        </Box>
      </Box>
    </Container>
  );
}

export default Profile;
