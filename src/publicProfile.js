import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import GitHubIcon from '@mui/icons-material/GitHub';
import { EmailIcon, LinkedinIcon, XIcon } from 'react-share';
import env from "./env";


function PublicProfile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProfile = async() => {
            try {
                const response = await fetch(env.backend_domain + '/users/${id}/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                const data = await response.json()
                if(!response.ok) {
                    throw new Error(data.error || 'Failed to fetch public profile')
                }

                setProfile(data)

            } catch (error) {
                setError(error.message)
            }
        }

        fetchProfile();
    }, [profile] )

    if(error) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" >
                        <LockPersonIcon sx={{ fontSize: 40, mb: 1}} />
                        <Typography variant="body1" color="error" align="center">
                            {error}
                        </Typography>
                    </Box>
              </Box>
            </Container>
        )
    }

    if (!profile) {
        return (
          <Container maxWidth="sm">
            <Typography variant="body1" align="center">
              Loading profile...
            </Typography>
          </Container>
        )
    }

    const handleEmailClick = () => {
        navigator.clipboard.writeText(profile.socialEmail).then(() => {alert('Email address copied to clipboard!')})
    }
    
    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Box display="flex" justifyContent="center" alignItems="center" position="relative">
                    <Avatar
                        sx={{ bgcolor: 'primary.main', width: 70, height: 70, mt: -6 }}
                        src={ profile.profileImage ? env.backend_domain + '/users/profile-image/${profile.profileImage}' : '' }
                    >
                        {!profile.profileImage && <AccountCircleIcon fontSize="large" />}
                        {/* <AccountCircleIcon fontSize="large" /> */}
                    </Avatar>
                </Box>
                <Typography variant="h5" align="center" gutterBottom>
                    {profile.username || 'Profile'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }} >
                    {profile.github && (
                        <a
                            href={profile.github}
                            target='_blank'
                        >
                            <GitHubIcon sx={{ fontSize: 29, color: 'black' }}/>
                        </a>
                    )}
                    {profile.socialEmail && (
                        <Box
                            sx={{ alignItems: 'center', cursor: 'pointer' }}
                            onClick={handleEmailClick}
                        >
                            <EmailIcon size={30} round={true} />
                        </Box>
                    )}
                    {profile.linkedin && (
                        <a
                            href={profile.linkedin}
                            target='_blank'
                        >
                            <LinkedinIcon size={30} round={true} />
                        </a>
                    )}
                    {profile.twitter && (
                        <a
                            href={profile.twitter}
                            target='_blank'
                        >
                            <XIcon size={30} round={true} />
                        </a>
                    )}
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1"><strong>Email:</strong> {profile.email}</Typography>
                    <Typography variant="body1"><strong>Username:</strong> {profile.username}</Typography>
                </Box>
            </Box>
        </Container>
    )

}

export default PublicProfile;