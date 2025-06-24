import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Container, Typography, Box, TextField, Avatar, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { EmailIcon, LinkedinIcon, XIcon } from 'react-share'
import GitHubIcon from '@mui/icons-material/GitHub';

import Cropper from 'react-easy-crop';
import getCroppedImg from '../middleware/cropImage';
import env from "./env";


function ProfileEdit({profile, onUpdateProfile}) {
    const [username, setUsername] = useState(profile?.username || '');
    const [email, setEmail] = useState(profile?.email || '');
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('');
    const [profileImage, setProfileImage] = useState(profile?.profileImage || null);
    const [deleteImage, setDeleteImage] = useState(false);
    const [isImageDeleted, setIsImageDeleted] = useState(false);
    const [github, setGithub] = useState(profile?.github || '')
    const [linkedin, setLinkedin] = useState(profile?.linkedin || '')
    const [twitter, setTwitter] = useState(profile?.twitter || '')
    const [socialEmail, setSocialEmail] = useState(profile?.socialEmail || '')
    const initialised = useRef(false);

    const [selectedFile, setSelectedFile] = useState({ url: null, type: null});
    const [croppedImage, setCroppedImage] = useState(null);
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!initialised.current && profile) {
            setUsername(profile.username || '')
            setEmail(profile.email || '')
            setProfileImage(profile.profileImage || null)
            setGithub(profile.github || '')
            setLinkedin(profile.linkedin || '')
            setTwitter(profile.twitter || '')
            setSocialEmail(profile.socialEmail || '')
            initialised.current = true;
        }
    }, [profile])

    useEffect(() => {
        setDeleteImage(!!profileImage)
    }, [profileImage])

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        // console.log('cropped Area:', croppedArea, 'croppedAreaPixels:', croppedAreaPixels)
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])


    if (!profile) {
        return (
          <Container maxWidth="sm">
            <Typography variant="body1" align="center">
              Loading profile...
            </Typography>
          </Container>
        );
    }

    const handleImageChange = async(e) => {
        const file = e.target.files[0];
        if(file) {
            const mimeType = file.type;
            // console.log('type:', mimeType)
            setSelectedFile({ url: URL.createObjectURL(file), type: mimeType})
            setShowCropper(true)
        }
    }


    const handleCrop = async () => {
        try {
            const croppedImg = await getCroppedImg(selectedFile.url, croppedAreaPixels, selectedFile.type)
            setCroppedImage(croppedImg)
            setImage(URL.createObjectURL(croppedImg))
            setShowCropper(false)
            // console.log('Cropped Image:', croppedImg)
        } catch (error) {
            setError('Error cropping image')
            console.error(error)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            setError('Passwords do not match')
            return;
        }

        let oldImgId;
        // const updateData = { userId: profile.id};
        const updateData = new FormData();
        updateData.append('userId', profile.id)
        if (username && username !== profile.username) updateData.append('username', username)
        // if (email && email !== profile.email) updateData.email = email;
        if (password) updateData.append('password', password)

        if (socialEmail !== profile.socialEmail) {
            updateData.append('socialEmail', socialEmail || 'null')
        }

        if (github !== profile.github) {
            updateData.append('github', github || 'null')
        }

        if (linkedin !== profile.linkedin) {
            updateData.append('linkedin', linkedin || 'null')
        }

        if (twitter !== profile.twitter) {
            updateData.append('twitter', twitter || 'null')
        }

        if (croppedImage) {
            updateData.append('profileImage', croppedImage)
            oldImgId = profileImage;
        }
        // else {
        //     console.log('croppedImage is not a valide File or is null:', croppedImage)
        // }

        // console.log('croppedImage:', croppedImage)

        if (Array.from(updateData.keys()).length <= 1 && isImageDeleted) {
            navigate('/profile')
            setIsImageDeleted(false)
            return;
        }else if(Array.from(updateData.keys()).length <= 1){
            setError('No changes made')
            return;
        }
        // console.log('Update Data:', updateData)

        const token = localStorage.getItem('token')

        // Update profile
        try {
            const response = await fetch(env.backend_domain + '/users/update-profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: updateData
            })

            const data = await response.json();
            if(response.ok) {
                // Update the token in local storage
                localStorage.setItem('token', data.token)
                console.log('Profile update successful! updated data:', data.user);

                // Delete old image if a new one is provided
                if( oldImgId && !isImageDeleted) {
                    try {
                        const imgDeleteResponse = await fetch(env.backend_domain + '/users/delete-old-image/${oldImgId}', {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        })

                        const deleteData = await imgDeleteResponse.json();
                        if(imgDeleteResponse.ok) {
                            console.log('old profile image deleted successfully!')
                        } else {
                            setError(deleteData.error || 'Failed to delete old profile image')
                        }
                    } catch (error) {
                        console.error('Internal Error deleting old profile img:', error)
                        setError('Internal server error while deleting old profile image')
                    }

                }
                
                setIsImageDeleted(false)
                onUpdateProfile(data.user);
                navigate('/profile')
            } else {
                setError(data.error || 'Failed to update profile')
            }


        } catch (error) {
            console.error('Error updating profile:', error)
            setError('Internal server error occurred')
        }

    }

    const handleDeleteImage = async() => {
        const token = localStorage.getItem('token')

        try {
            const response = await fetch(env.backend_domain + '/users/delete-image/${profileImage}', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            const data = await response.json();
            if(response.ok) {
                setProfileImage(null)
                setImage(null)
                setDeleteImage(false)
                console.log('Profile image deleted successfully')
                setIsImageDeleted(true)
            } else {
                setError(data.error || 'Failed to delete profile image')
            }


        } catch (error) {
            console.error('Error deleting profile image:', error)
            setError('Internal server error occurred')
        }

    }


  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" position="relative">
          <Avatar 
            sx={{ bgcolor: 'primary.main', width: 70, height: 70 }}
            src={ image ? image : (profileImage ? env.backend_domain + '/users/profile-image/${profileImage}' : '' )}
            // src={image || (profile?.profileImage ? `http://localhost:3000/users/profile-image/${profile.profileImage}` : '' )}
          >
            {!image && !profileImage && <AccountCircleIcon fontSize="large" />}
            {/* <AccountCircleIcon fontSize="large" /> */}
          </Avatar>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" position="relative">
            <Button
                variant="text"
                size="small"
                sx={{textTransform:'none'}}
                component="label"
            >
                edit image
                <input
                    type="file"
                    accept='image/*'
                    hidden
                    name="profileImage"
                    onChange={handleImageChange}
                />
            </Button>
            {deleteImage && (
                <Button
                variant='text'
                size="small"
                sx={{textTransform:'none'}}
                onClick={handleDeleteImage}
            >
                delete image
            </Button>
            )}
        </Box>
        {showCropper && (
            <Box sx={{ mt: 2, mb: 2, position: 'relative', width: '100%', height: 200}}>
                <Cropper
                    image={selectedFile.url}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
                <Button
                    variant='contained'
                    color='primary'
                    size="small"
                    onClick={handleCrop}
                    sx={{ position: 'absolute', bottom: 5, right: 5, textTransform:'none' }}
                >
                    Done
                </Button>
            </Box>
        )}
        <Typography variant="h5" align="center" gutterBottom>
          {profile.username || 'Profile'}
        </Typography>
        <form onSubmit={handleSubmit}>
            <Box sx={{ mt: 2 }}>
                <Typography variant="body1"><strong>Email:</strong> {email}</Typography>
                <TextField 
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                />
                <TextField 
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                />
                <TextField 
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.9 }}>
                    <GitHubIcon sx={{ fontSize: 30, ml: '-1px' }} />
                    <TextField 
                        label="GitHub URL"
                        type="url"
                        variant="outlined"
                        size='small'
                        fullWidth
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        margin="normal"
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <EmailIcon size={30} round={true} />
                    <TextField 
                        label="Email URL"
                        type="url"
                        variant="outlined"
                        size='small'
                        fullWidth
                        value={socialEmail}
                        onChange={(e) => setSocialEmail(e.target.value)}
                        margin="normal"
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <LinkedinIcon size={30} round={true} />
                    <TextField 
                        label="LinkedIn URL"
                        type="url"
                        variant="outlined"
                        size='small'
                        fullWidth
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        margin="normal"
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <XIcon size={30} round={true} />
                    <TextField 
                    label="Twitter URL"
                    type="url"
                    variant="outlined"
                    size='small'
                    fullWidth
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    margin="normal"
                />
                </Box>

                {error && (
                    <Typography variant="body2" color="error" align="center">
                        {error}
                    </Typography>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2}}
                >
                    Save Changes
                </Button>
            </Box>
        </form>
        <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 2}}
            onClick={() => navigate('/profile')}
        >
            Cancel
        </Button>
      </Box>
    </Container>
  );
}

export default ProfileEdit;
