// server.js

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import ACTIONS from './src/action.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'dist' folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));

const userSocketMap = {};
const roomTabs = {}; // Stores tabs for each room

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(socketId => {
    return {
      socketId,
      username: userSocketMap[socketId]?.username,
    };
  });
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = { username };
    socket.join(roomId);

    if (!roomTabs[roomId]) {
      roomTabs[roomId] = [
        { id: 1, name: "file1.js", code: "// Start coding", language: "javascript" }
      ];
    }

    socket.emit(ACTIONS.SYNC_TABS, { tabs: roomTabs[roomId] });

    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, tabId, code }) => {
    if (roomTabs[roomId]) {
      const tab = roomTabs[roomId].find(t => t.id === tabId);
      if (tab) {
        tab.code = code;
        socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { tabId, code });
      }
    }
  });

  socket.on(ACTIONS.ADD_TAB, ({ roomId, tab }) => {
    if (roomTabs[roomId]) {
      roomTabs[roomId].push(tab);
      io.in(roomId).emit(ACTIONS.ADD_TAB, { tab });
    }
  });

  socket.on(ACTIONS.DELETE_TAB, ({ roomId, tabId }) => {
    if (roomTabs[roomId]) {
      roomTabs[roomId] = roomTabs[roomId].filter(tab => tab.id !== tabId);
      io.in(roomId).emit(ACTIONS.DELETE_TAB, { tabId });
    }
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id]?.username,
      });
    });
    delete userSocketMap[socket.id];
  });
});

// This is the catch-all route that must be correct.
// It sends the main HTML file for any page request.
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));