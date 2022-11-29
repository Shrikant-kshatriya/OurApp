const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const {getdate} = require('../utility');

module.exports = {
    // post an article
    postArticle: function(req, res){
        if(req.isAuthenticated()){
            const {title, body} = req.body;
            const date = getdate();
            User.findById(req.user.id, (err, foundUser) => {
                if(!err){
                    foundUser.posts.push({title: title, body: body, date: date});
                    foundUser.save(err => {
                        if(!err){
                            req.flash('success', 'Successfully posted.');
                            res.redirect('/users/'+foundUser.username);
                        }
                    });
                }
            });
        }else{
            req.flash('error', 'Login to post.');
            res.redirect('/');
        }
    },

    // render singlepage article
    singlePagePost: function(req, res){
        if(req.isAuthenticated()){
            
            const {postid} = req.params;
            User.findOne({'posts._id': postid}, (err, foundUser) => {
                User.findById(req.user.id, (err, currUser) => {
                    
                    foundUser.posts.forEach(post => {
                        if(post._id.toString() === postid){
                            const message = req.flash();
                            res.render('single-post-screen', {user: foundUser, currUser: currUser, post: post, success: message.success});
                        }
                    });
                });
            });
        }else{
            res.redirect('/');
        }
    },

    // render editpage
    renderEditPage: function(req, res){
        if(req.isAuthenticated()){
            const {postid} = req.params;
            User.findOne({'posts._id': postid}, (err, foundUser) => {
                User.findById(req.user.id, (err, currUser) => {
                    foundUser.posts.forEach(post => {
                        if(post._id.toString() === postid){
                            res.render('edit-post', {currUser: currUser, post: post})
                        }
                    });
                });
            });

        }else{
            res.redirect('/');
        }
    },

    // editPost 
    editPost: function(req, res){
        if(req.isAuthenticated()){
            const {postid} = req.params;
            const editedpost = {
                title: req.body.title,
                body: req.body.body,
                date: getdate(),
                _id: postid
            }
            User.findOneAndUpdate({'posts._id': postid}, {'posts.$': editedpost},{overwrite: false}, (err, result) => {
                if(!err){
                    console.log(result);
                    req.flash('success', 'Edited Successfully');
                    res.redirect(`/posts/${postid}`);
                }
            });
        }else{
            res.redirect('/');
        }
    },

    // deletePost
    deletePost: function(req, res){
        if(req.isAuthenticated()){
            const {postid} = req.params;
            User.updateOne({'posts._id': postid},{$pull: {posts: {_id: postid}}},(err, result) => {
                if(!err){
                    console.log(result);
                    req.flash('success', 'Deleted Successfully');
                    res.redirect(`/users/${req.user.username}`);
                }
            });
                

        }else{
            res.redirect('/');
        }
    }
}