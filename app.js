const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const registerRouter = require('./src/Routers/registerRouter')
const loginRouter = require('./src/Routers/loginRouter');
const profileRouter = require('./src/Routers/profileRouter');
const snippetRouter = require('./src/Routers/snippetsRouter'); 
const authenticateToken = require('./middleware/authenticateToken');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const jwt = require('jsonwebtoken');
const { GridFSBucket } = require('mongodb')
const User = require('./src/model/user');
const verifyToken = require('./middleware/verifyToken')


const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

// Require CORS
const cors = require('cors');

// MongoDB Configuration
const url = process.env.MONGO_URL
mongoose.connect(url)
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error: ', err))

const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type']
}
// Enable CORS for all requests
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: 'profileImages'
  })
  console.log('GridFS initialised!')
})



// Placeholder for storing snippets in memory
let snippets = [];

// Serve static files like CSS and the bundled React app
app.use(express.static(path.join(__dirname, 'public')));

// Add middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this if using JSON payload

// Register route
app.use('/users', registerRouter);

// Login route
app.use('/users', loginRouter);

// Profile route
app.use('/users', profileRouter);

app.use('/api', snippetRouter);

// API routes for snippets
app.get('/api/snippets', (req, res) => {
  res.json({ snippets });
});

app.post('/api/snippets', (req, res) => {
  console.log('Request body:', req.body);
  if (req.body.snippet) {
    console.log('Snippet submitted:', req.body.snippet);
    snippets.push({ code: req.body.snippet });
  } else {
    console.log('Snippet is undefined');
  }
  res.json({ success: true });
});

app.get('/api/validate-session', (req, res) => {
  const token = req.session.token;
  if (!token) {
      console.log('no token')
      return res.json({ isAuthenticated: false, error: 'Unuthorised, Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify token
    if(decoded.exp * 1000 < Date.now()) {
      return res.json({ isAuthenticated: false, isTokenExpired: true })
    }else {
      req.user = decoded
      return res.json({ isAuthenticated: true });
    }

  } catch (error) {
    console.log('internal server error', error)
    return res.status(401).json({ isAuthenticated: false, error: 'Unauthorised, invalid token'});
  }

});

// Retrieve user profile image
app.get('/users/profile-image/:id', async(req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id)
    const downloadStream = gfs.openDownloadStream(fileId)
    
    // downloadStream.on('file', (file) => {
    //   res.set({
    //     'Content-Type': file.contentType,
    //     'Content-Disposition': `inline; filename="${file.filename}"`,
    //   })
    // })
    downloadStream.pipe(res)

    // downloadStream.on('error', (err)=> {
    //   console.error('Error during image retrieval stream:', err)
    //   res.status(400).json({ error: 'Profile image not found'})
    // })
    // console.log(gfs.openDownloadStream(fileId).pipe(res))
  } catch (error) {
    console.error('Error retrieving profile image:', error)
    res.status(500).json({error: 'An error occurred while retrieving the profile'})
  }
})

// Delete user profile image
app.delete('/users/delete-image/:id', verifyToken, async(req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id)
    console.log('fileId:', fileId)
    await gfs.delete(fileId);

    await User.findByIdAndUpdate(req.user.id, { profileImage: null})

    res.status(200).json({ message: 'Profile image deleted successfully'})
  } catch (error) {
    console.error('Error deleting profile image:', error)
    res.status(500).json({ error: 'An error occurred while deleting the profile image'})
  }
})

// Delete user's old profile image
app.delete('/users/delete-old-image/:id', verifyToken, async(req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id)
    await gfs.delete(fileId)
    
    res.status(200).json({ message: 'Old profile image deleted successfully'})
  } catch (error) {
    console.error('Error deleting old profile image:', error)
    res.status(500).json({ error: 'An error occurred while deleting the old profile image'})
  }
})



// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});