const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const https = require('https');
const {checkFollowing} = require('../utility');
const {getPicDataFollower, getPicDataFollowing} = require('./help');
const validator = require('validator');

module.exports = {
    // register a user
    registerUser: function(req, res){
        // validation
        const {username, email, password} = req.body;
        let username_err, email_err, password_err;
        
        if(validator.isEmpty(username)){
            username_err = 'Cannot be empty.';
            res.render('home-guest', {username_err,email_err,password_err,username,email,password});
        }else if(validator.isEmpty(email) || !validator.isEmail(email)){
            email_err = 'Invalid email.'
            res.render('home-guest', {username_err,email_err,password_err,username,email,password});
        }else if(validator.isEmpty(password) || !validator.isLength(password, {min:6})){
            password_err = 'Password must be atleast 6 characters';
            res.render('home-guest', {username_err,email_err,password_err,username,email,password});
        }else{

        // registration
        // -----checking if alredy registered
        User.find({username},(err, foundUser) => {
            if(foundUser.length > 0){
                req.flash('error', 'Account already exists');
                res.redirect('/');
            }else{
                User.register({username: username, email: email}, password, (err, user) => {
                    if(err){
                        res.redirect('/');
                    }else {
                        // log in after registration
                        passport.authenticate('local', { failureFlash: true,failureRedirect: '/'})(req, res, () => {
                        // img
                            const url = `https://avatars.dicebear.com/api/avataaars/${username}.jpg`;
                            https.get(url, (response) => {
                                response.on('data', (d) => {
                                    User.updateOne({username: username}, {'picture.data': d}, err => res.redirect('/'));
                                });

                                }).on('error', (e) => {
                                console.error(e);
                            });
                            
                        });
                    }
                });
            }
        });
        
         
    }},

    // login a user
    loginUser: function(req, res){
        passport.authenticate('local', { failureFlash: true,failureRedirect: '/'})(req, res, () => {        
            res.redirect('/')
        });
    },

    // logout a user
    logoutUser: function(req, res){
        req.logout((err) => {
            if(!err)res.redirect('/');
        });
    },

    // render Users profile
    renderProfile: function(req, res){
        if(req.isAuthenticated()){
            const {username} = req.params;
        User.findOne({username: username}, (err, foundUser) => {
            const message = req.flash();
            User.findById(req.user.id, (err, currUser) => {
                const follow = checkFollowing(currUser, foundUser);
                res.render('profile', {success: message.success, currUser: currUser, user: foundUser, follow: follow});
            });
        });
        }else{
            res.redirect('/');
        }
    },

    // render users profile follower
    renderProfileFollower: function(req, res){
        if(req.isAuthenticated()){
            const {username} = req.params;
        User.findOne({username: username}, (err, foundUser) => {
            const message = req.flash();
            User.findById(req.user.id,async (err, currUser) => {
                const follow = checkFollowing(currUser, foundUser);
                // getting user pic array
                const picArray = await getPicDataFollower(foundUser);
                res.render('profile-followers', {success: message.success, currUser: currUser, user: foundUser, follow: follow,pictureData: picArray});
            });
        });
        }else{
            res.redirect('/');
        }
    },

    // render users profile following
    renderProfileFollowing: function(req, res){
        if(req.isAuthenticated()){
            const {username} = req.params;
        User.findOne({username: username}, (err, foundUser) => {
            const message = req.flash();
            User.findById(req.user.id,async (err, currUser) => {
                const follow = checkFollowing(currUser, foundUser);
                
                // getting user pic array
                const picArray = await getPicDataFollowing(foundUser);
                
                res.render('profile-following', {success: message.success, currUser: currUser, user: foundUser, follow: follow,pictureData: picArray});
            });
        });
        }else{
            res.redirect('/');
        }
    },


    // follow a user
    followUser: function(req, res){
        if(req.isAuthenticated()){
            const {username} = req.params;
            User.updateOne({username: username},{$push: {follower: req.user.username}},(err, result) => {
                if(!err){
                    User.updateOne({username: req.user.username}, {$push: {following: username}}, (err, result) => {
                        
                        console.log(result);
                        req.flash('success', 'Followed');
                        res.redirect(`/users/${username}`);
                    });
                }
            });
                

        }else{
            res.redirect('/');
        }
    },
    
    // unfollow a user
    unfollowUser: function(req, res){
        if(req.isAuthenticated()){
            const {username} = req.params;
            User.updateOne({username: username},{$pull: {follower: req.user.username}},(err, result) => {
                if(!err){
                    User.updateOne({username: req.user.username}, {$pull: {following: username}}, (err, result) => {
                        
                        console.log(result);
                        req.flash('success', 'Unfollowed');
                        res.redirect(`/users/${username}`);
                    });
                }
            });
                

        }else{
            res.redirect('/');
        }
    }

}