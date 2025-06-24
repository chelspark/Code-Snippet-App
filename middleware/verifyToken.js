const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

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


module.exports = verifyToken;