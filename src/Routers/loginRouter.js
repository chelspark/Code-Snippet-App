const express = require('express');
const User = require('../model/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

// Endpoint -> /users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('req body email: ', email, 'req body password: ', password)

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    try {
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(400).json({ error: 'User does not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).json({ error: 'User password not matched'})
        }

        const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '24h' })

        res.status(200).json({ message: 'Login successful', token, username: user.username, user: user})
    } catch (error) {
        console.error('Logging in error: ', error)
        res.status(500).json({ error: 'Internal server error'})
    }

})

module.exports = router;