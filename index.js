const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'));
});

io.on('connection', (socket) => {
    if (socket.recovered) {
        console.log(`*A user has reconnected*`);
    } else {
        console.log(`*A user has connected*`);
        io.emit('chat message', '*Un usuario se ha conectado*');
    }

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log(`*user disconnected*`);
    io.emit('chat message', `*Un usuario se ha desconectado*`);
  });
});

server.listen(20001, () => {
  console.log('server running at http://localhost:20001');
});