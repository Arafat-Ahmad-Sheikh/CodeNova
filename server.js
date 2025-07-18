import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import ACTIONS from './src/action.js';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

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

    // Initialize room with default tab if empty
    if (!roomTabs[roomId]) {
      roomTabs[roomId] = [
        { id: 1, name: "file1.js", code: "// Start coding", language: "javascript" }
      ];
    }

    // Send current tabs to the joining client
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

  // Handle code changes
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, tabId, code }) => {
    if (roomTabs[roomId]) {
      const tab = roomTabs[roomId].find(t => t.id === tabId);
      if (tab) {
        tab.code = code;
        socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { tabId, code });
      }
    }
  });

  // Handle tab additions
  socket.on(ACTIONS.ADD_TAB, ({ roomId, tab }) => {
    if (roomTabs[roomId]) {
      roomTabs[roomId].push(tab);
      io.in(roomId).emit(ACTIONS.ADD_TAB, { tab });
    }
  });

  // Handle tab deletions
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
