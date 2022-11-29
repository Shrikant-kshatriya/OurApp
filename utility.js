const passport = require('passport');
const express = require('express');
const User = require('./models/User');
const mongoose = require('mongoose');
const moment = require('moment');

module.exports = {
    getdate : function(){
        const date = new Date;
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    },

    checkFollowing: function(currUser, user){
        if(currUser.username === user.username){
            return "same";
        }else{
            if(currUser.following.length !== 0){
                for(let i = 0; i <= currUser.following.length; i++){
                    if(currUser.following[i] === user.username){
                        return "followed"}
                    else{ return "not followed"}
                };
            }else {return "not followed"}
        }
    },

    getPicData: async function(username){
        User.findOne({username: username}).then((err, foundPic) => {
            const pic = foundPic.picture.data.toString('base64');
            return pic;
        });
    },

    
    
}

// users socket
const users = [];
//Join user to chat
module.exports.sockets = {

     
    // user joins chat
    userJoin: function(id, username){
        
        const user = {username, id};
        users.push(user);
        return user;

    },

    // get currUser
    getCurrentUser: function(id){
        return users.find(user => user.id === id);
    },


    // user leaves chat
    userLeaves: function(id){
        const index = users.findIndex(user => user.id === id);
        if(index !== -1){
            return users.splice(index, 1)[0];
        }
    },

    // getUsers
    getChatUsers: function(){
        return users;
    },

    // socket utility
    formatMessage: function(username, text){
        return {
            username, 
            text,
            time: moment().format('h:mm a')
        }
    }
}