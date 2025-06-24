const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const upload = require('../../middleware/upload')
const mongoose = require('mongoose');
const Snippet = require('../model/snippet');


const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify token
    req.user = decoded; // Attach decoded token payload (user data) to request object
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized, invalid token' });
  }
};

// GET /users/profile - Retrieve user details from token
router.get('/profile', verifyToken, async (req, res) => {
  // Since you're not storing the profile, use the decoded JWT token details
  const { username, email, id } = req.user;
  const user = await User.findById(id)
  res.json({
    success: true,
    profile: {
      username: username,
      id: id,  // You can choose to display the id if necessary
      email: user.email, // Mock email based on the username, or customize it
      profileImage: user.profileImage,
      favourites: user.favourites,
      profileVisibility: user.profileVisibility,
      socialEmail: user.socialEmail,
      github: user.github,
      linkedin: user.linkedin,
      twitter: user.twitter,
    },
  });
});

// PUT /users/update-profile - Update user profile
router.put('/update-profile', verifyToken, upload.single('profileImage'), async (req, res) => {
  // console.log('Request Body:', req.body)
  // console.log('Uploaded File:', req.file)
  // if(!req.file || !req.file.id) {
  //   return res.status(500).json({error: 'File upload failed, no _id returned'})
  // }
  const { username, password, socialEmail, github, linkedin, twitter } = req.body;
  const userId = req.user.id;
  let file;
  if (req.file) {
    file = req.file._id || req.file.id;
  }
  // console.log('username:', username, 'password:', password, 'file:', file)

  if(!userId) {
    return res.status(400).json({error: 'User ID is required'})
  }

  const updateData = {};
  if (username) updateData.username = username;
  // if (email) updateData.email = email;

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateData.password = hashedPassword;
  }

  if (file) updateData.profileImage = file

  updateData.socialEmail = socialEmail === 'null' ? null : socialEmail
  updateData.github = github === 'null' ? null : github
  updateData.linkedin = linkedin === 'null' ? null : linkedin
  updateData.twitter = twitter === 'null' ? null : twitter

  // console.log('Update Data:', updateData)

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true}
    );

    console.log('updatedUser: ', updatedUser)

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new token with the udpated user info
    const newToken = jwt.sign(
      { id: updatedUser._id, username: updatedUser.username },
      SECRET_KEY,
      { expiresIn: '24h' }

    )

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser, token: newToken});
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'An error occurred while updating the profile'})
  }
})

// PUT /users/profile-visibility - Update user profile visibility
router.put('/profile-visibility', verifyToken, async(req, res) => {
  const userId = req.user.id;
  const { visibility } = req.body;

  if(!['public','private'].includes(visibility)) {
    return res.status(400).json({ error: 'Invalid visibility value'})
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileVisibility: visibility },
      { new: true, runValidators: true}
    )

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found'})
    }

    res.status(200).json({ message: 'Profile visibility updated successfully', visibility: updatedUser.profileVisibility})

  } catch (error) {
    console.error('Error updating profile visibility:', error)
    res.status(500).json({ error: 'An error occurred while updating profile visibility'})
  }

})

// GET /users/:id/profile - Get public user profile
router.get('/:id/profile', async(req,res) => {
  try {
    const user = await User.findById(req.params.id)

    if(!user) {
      return res.status(404).json({ error: 'User not found'})
    }

    if(user.profileVisibility !== 'public'){
      return res.status(403).json({ error: 'This profile is private'})
    }

    res.status(200).json({
      username: user.username,
      email: `${user.username}@example.com`,
      profileImage: user.profileImage,
      profileVisibility: user.profileVisibility,
      github: user.github,
      socialEmail: user.socialEmail,
      linkedin: user.linkedin,
      twitter: user.twitter,
    })

  } catch (error) {
    console.error('Error retreiving profile:', error)
    res.status(500).json({ error: 'An error occurred while retrieving the profile'})
  }
})

// PUT /users/add-favourites - Update user favourites
router.put('/add-favourites', verifyToken, async(req, res) => {
  const userId = req.user.id;
  const { favourites } = req.body;
  console.log('userid:', userId)
  console.log('snippet id:', favourites)

  try {
    const updatedUser =  await User.findByIdAndUpdate(
      userId,
      { $addToSet: {favourites} },
      { new: true, runValidators: true }
    )

    if(!updatedUser) {
      console.log('user not found')
      return res.status(404).json({ error: 'User not found'})
    }

    console.log('updated user:', updatedUser)
    res.status(200).json({ user: updatedUser })

  } catch (error) {
    console.error('Error updating favourites:', error)
    res.status(500).json({ error: 'An error occurred while updating favourites'})
  }
})

// PUT /users/delete0favourites - Delete favourites
router.put('/delete-favourites', verifyToken, async(req, res) => {
  const userId = req.user.id;
  const { favourites } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favourites } },
      { new: true, runValidators: true }
    )

    if(!updatedUser) {
      console.log('user not found')
      return res.status(404).json({ error: 'User not found'})
    }

    console.log('updated user after deletion:', updatedUser)
    res.status(200).json({ user: updatedUser })

  } catch (error) {
    console.error('Error deleting favourites:', error)
    res.status(500).json({ error: 'An error occurred while deleting favourites'})
  }
})

// GET /users/profile/favourites - GET user favourites
router.get('/profile/favourites', verifyToken, async(req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user || !user.favourites || user.favourites.length === 0) {
      return res.status(200).json({ favourites: [] }) 
    }

    const favSnippets = await Promise.all(
      user.favourites.map(async (favouritesId) => {
        try {
          const snippet = await Snippet.findById(favouritesId);
          return snippet
        } catch (error) {
          console.error(`Failed to fetch snippet with id ${favouritesId}:`, err)
          return null;
        }
      })
    )

    const validFavSnippets = favSnippets.filter((snippet) => snippet !== null)
    // console.log('validFavSnippets:', validFavSnippets)

    res.status(200).json({ favourites: validFavSnippets })
  } catch (error) {
    console.err('Error fetching favourite snippets:', error)
    res.status(500).json({ error: 'An error occurred while fetching favourite snippets'})
  }

})


module.exports = router;