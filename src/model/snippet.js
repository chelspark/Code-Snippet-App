const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    description: String,
    created_date: {
        type: Date,
        default: Date.now
    },
    last_update_date: {
        type: Date,
        default: Date.now
    },
    fulltext: String,
    language: {
        type: String,
        enum: ['javascript', 'python', 'csharp'] // TODO Add more languages as they are supported
    },
    language_version: String,
    visibility: {
        type: String,
        enum: ['public', 'private', 'unlisted']
    }
});

// Automatically sets the last_update_date every time the snippet is modified
// I'm not sure entirely how this works, I believe it only triggers if 'save' is called on the model, but I don't
// know if 'save' is called automatically by Mongoose at any point when working with a model.
// TODO This should only trigger if the fulltext of the snippet is modified, don't know how to do that yet
snippetSchema.pre('save', function(next) {
    this.last_update_date = new Date();
    next();
});

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
