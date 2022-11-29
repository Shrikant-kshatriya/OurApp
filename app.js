const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const http = require('http');
const socketio = require('socket.io');


const app = express();
// socket server
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));


// session
app.use(session({
    secret: "my social app??",
    resave: true,
    saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());

// method-override
app.use(methodOverride('_method'));

// Setting up passport and DB
require('./db')();

// socket
require('./socket')(io);

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));


// listen to port
server.listen(PORT, console.log(`Server running on port ${PORT}`));