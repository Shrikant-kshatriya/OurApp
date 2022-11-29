const { default: mongoose } = require("mongoose");
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const utility = require('../utility'); 

const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    date: {
        type: String
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required : true
    },
    posts: [postSchema],
    following: [String],
    follower: [String],
    picture: {
        data: Buffer,
        contentType: {
            type: String,
            default: 'image/jpg'
        }
    }
});

// plugins
userSchema.plugin(passportLocalMongoose);

// Creating Model
const User = mongoose.model('User', userSchema);

module.exports = User;
