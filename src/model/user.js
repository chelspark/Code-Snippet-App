const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
    snippets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Snippet'
    }],
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Snippet',
    }],
    profileImage: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'profileImages'
    },
    profileVisibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'private'
    },
    github: {
        type: String,
        default: null,
    },
    linkedin: {
        type: String,
        default: null,
    },
    twitter: {
        type: String,
        default: null,
    },
    socialEmail: {
        type: String,
        default: null,
    },

});

const User = mongoose.model('User', UserSchema);

module.exports = User;