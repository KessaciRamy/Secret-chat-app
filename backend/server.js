import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import chatSocket from './sockets/chat.socket.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});


chatSocket(io);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
} )