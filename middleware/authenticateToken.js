const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if(!token){
        return res.status(401).json({ message: 'Authentication failed. No token provided.' })
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        req.user = decoded
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.redirect('/login?error=tokenExpired')
        }
        // res.status(401).json({ message: 'Invalid token.' })
        res.redirect('/login?error=loginRequired')
    }

}

module.exports = authenticateToken;