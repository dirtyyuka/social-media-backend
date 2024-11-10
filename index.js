require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');
const path = require('path');
const signup = require('./services/signup');
const signin = require('./services/signin');
const search = require('./services/search');
const follow = require('./services/follow');
const following = require('./services/following');
const followers = require('./services/followers');
const friendList = require('./services/friendList');
const cookieParser = require('cookie-parser');
const authenticate = require('./middlewares/authentication');

//initialize express 
const app = express();
const server = http.createServer(app);
const io = new Server(server);

//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//authentication middleware
app.use(authenticate);


//*handle socket connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', ({ userId, friendId }) => {
    const roomId = `room_${Math.min(userId, friendId)}_${Math.max(userId, friendId)}`;
    socket.join(roomId);
    console.log(`User ${userId} joined room: ${roomId}`);
  })

  //*send message
  socket.on('chat message', ({ roomId, message, sender }) => {
    io.to(roomId).emit('chat message', { message, sender });
  })

  //*leave room
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  })
})

//*routes
app.get('/', (req, res) => {
  res.render('home', {
    user: req.user
  })
})

app.get('/signup', (req, res) => {
  res.render('signup');
})

app.get('/signin', (req, res) => {
  res.render('signin');
})

app.post('/signup', signup);

app.post('/signin', signin);

app.get('/search', search);

app.post('/follow/:id', follow);

app.get('/profile', (req, res) => {
  res.render('profile', {
    user: req.user
  })
})

app.get('/signout', (req, res) => {
  res.clearCookie('token').redirect('/signin');
})

app.get('/followers', followers);

app.get('/following', following);

app.get('/friends', (req, res) => {
  res.render('friends', {
    user: req.user
  })
})

app.get('/friendList', friendList);

app.get('/chat', (req, res) => {
  const { id } = req.query;
  res.render('chat', {
    user: req.user,
    friendId: id
  })
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
})