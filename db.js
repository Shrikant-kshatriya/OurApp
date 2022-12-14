require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

module.exports = function(){
    // connect to db
    mongoose.connect(process.env.MONGODB_URI);

    // Getting model
    const User = require('./models/User');

    // Local Strategy by passport-local-mongoose
    passport.use(User.createStrategy());

    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
        return cb(null, {
            id: user.id,
            username: user.username,
            picture: user.picture
        });
        });
    });
    
    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
        return cb(null, user);
        });
    });
}