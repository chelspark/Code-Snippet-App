const { GridFsStorage } = require('multer-gridfs-storage')
const multer = require('multer');
require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL;

// Multer configuration for file uploads

const storage = new GridFsStorage({
    url: MONGO_URL,
    // options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            let bucketName;

            if (file.mimetype.startsWith('image/')) {
                bucketName = 'profileImages';
            } else {
                return reject(new Error('Invalid file type. Only images are allowed.'))
            }

            // console.log('bucketName:', bucketName)

            const filename = Date.now() + `-${file.originalname}`
            const fileInfo = {
                filename: filename,
                bucketName: bucketName,
            }
            // console.log('fileInfo:', fileInfo)

            resolve(fileInfo)
        })
    }
})

storage.on('connection', (db) => {
    console.log('Connected to the MongoDB GridFS instance successfully')
})

storage.on('error', (err) => {
    console.log('Storage error:', err)
})

const upload = multer({storage})

module.exports = upload;