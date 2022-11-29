const User = require("../models/User");
const express = require('express');
const { json } = require("express");

module.exports = {
    // render dashboad or guestpage
    renderHome: function(req, res){
        if(req.isAuthenticated()){
            User.findById(req.user.id, async (err, foundUser)=> {
                // dashboard posts
                let dashPosts;
                await User.find({follower: foundUser.username},{username: 1, picture: 1, posts: {'$slice': -1}}).then((result) => {
                    dashPosts = result;
                });                
                res.render('home-dashboard',{currUser: foundUser, dashPosts: dashPosts});
            });
        }else{
            const message = req.flash();
            res.render('home-guest', {message: message.error});
        }
    },

    // render create post page
    renderCreatePost: function(req, res){
        if(req.isAuthenticated()){
            User.findById(req.user.id, (err, foundUser)=> {
                res.render('create-post',{currUser: foundUser});
            });
        }else{
            req.flash('error', 'Login to post.');
            res.redirect('/');
        }
    },

    // search for query
    searchQuery: async function(req, res){
        if(req.isAuthenticated){
            const {searchQuery} = req.params;
            await User.find({username: {'$regex': searchQuery, '$options': 'i'}},{username: 1, picture: 1}).then((result)  => {
                const data = [];
                result.forEach(result => {
                    const {picture, username} = result;
                    data.push( {
                        username,
                        picture: picture.data.toString('base64')
                    });
                   

                });
                res.end(JSON.stringify(data));
            });
        }else{
            res.redirect('/');
        }
    },

    renderChat: function(req, res){
        if(req.isAuthenticated()){
            User.findById(req.user.id, (err, foundUser)=> {
                res.render('chat',{currUser: foundUser});
            });
        }else{
            res.redirect('/');
        }
    }
}