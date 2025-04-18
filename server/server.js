const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',                   
      'https://your-vercel-frontend.vercel.app'  
    ],
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
    // Also echo message to sender
    socket.emit('receive_private_message', { sender, receiver, text });
  });

  socket.on('disconnect', () => {
    for (let username in users) {
      if (users[username] === socket.id) {
        console.log(`🔴 ${username} disconnected`);
        delete users[username];
        break;
      }
    }
    io.emit('user_list', Object.keys(users));
  });
});

// Use dynamic port for deployment
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
