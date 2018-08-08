'use strict';
const mongoose = require('mongoose');
const uuid = require('uuid');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    title: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    content: {type: String, required: true}
});

UserSchema.methods.apiRepr = function(user) {
    return {
        title: this.title || '',
        author: this.author || '',
        author: this._id || ''
    };
};

const User = mongoose.model('Post', PostSchema);

module.exports = {Post};