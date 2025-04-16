const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

let users = {};

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('register_user', (username) => {
    users[username] = socket.id;
    io.emit('user_list', Object.keys(users));
    console.log(`✅ ${username} registered`);
  });

  socket.on('private_message', ({ sender, receiver, text }) => {
    const receiverSocketId = users[receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_private_message', { sender, receiver, text });
    }
    // Sender should also see their own message
    socket.emit('receive_private_message', { sender, receiver, text });
  });


  socket.on('disconnect', () => {
    for (let username in users) {
      if (users[username] === socket.id) {
        delete users[username];
        break;
      }
    }
    io.emit('user_list', Object.keys(users));
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
