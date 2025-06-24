const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const router = express.Router();

// Endpoint -> /users/register
router.post('/register', async (req, res) => {
    console.log('Fully request body:', req.body);
    const { email, password, username } = req.body
    console.log('req body email: ', email, 'req body password: ', password)

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: 'Email already taken'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        console.log('hasehdPassword: ', hashedPassword)

        const newUser = new User({
            username,
            email: email,
            password: hashedPassword,
        })
        console.log('newUser created: ', newUser)

        await newUser.save().then(result => {
            console.log('User registered successfully!')
            res.status(201).json({ status: 'User registered successfully'})
        })
    } catch (error) {
        console.error('Registeration error', error)
        res.status(500).json({ error: 'Registeration error'})
    }
})

module.exports = router;