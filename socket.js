const socketio = require('socket.io');
const {formatMessage, userJoin, getCurrentUser, checkUser, userLeaves, getChatUsers} = require('./utility').sockets;
const User = require('./models/User');
const mongoose = require('mongoose');

module.exports = function(io){
    

    const botName = 'OurChat Bot';
    // run when user connects
    io.on('connection', socket => {

        socket.on('joinChat', username => {

            const user = userJoin(socket.id, username);

            // welcome current user
            socket.emit('message', formatMessage(botName,'Welcome to chat.'));
            // broadcast when a user connects
            socket.broadcast.emit('message', formatMessage(botName,`${username} has joined the chat.`));

            // send users and room info
            io.emit('chatUsers', getChatUsers());

        });


        // listen for chat message
        socket.on('chatMessage', (msg) => {
            const user = getCurrentUser(socket.id);
            io.emit('message', formatMessage(user.username, msg));
        });

        // runs on client disconnect
        socket.on('disconnect', () => {
            const user = userLeaves(socket.id);
            if(user){
                io.emit('message', formatMessage(botName,`${user.username} has left the chat.`));
                // send users and room info
                io.emit('chatUsers', getChatUsers());

            }
        });
    });

}