const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

const rooms = [];

const createRoomCode = (length) => {
  const characters = "1234567890abcdefghijklmnopqrstuvwxyz";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }
  console.log("room code generated: ", code);
  return code;
};

const createRoom = (roomId, hostID, hostNickname) => {
  console.log(
    "creating a room for ",
    hostNickname,
    " with id : ",
    hostID,
    "..."
  );

  const roomData = {
    roomId: roomId,
    hostID: hostID,
    players: [{ id: hostID, nickname: hostNickname, cards: [] }],
    timer: 5,
    cards: 4,
    deck: [],
    status: "menu",
  };
  return roomData;
};

io.on("connection", (socket) => {
  console.log(socket.id + " is connected");

  io.emit("connected", "hello ");
  socket.on("create-room", (nickname) => {
    const code = createRoomCode(4);
    socket.join(code);
    const roomData = createRoom(code, socket.id, nickname);
    io.emit("room-created", roomData);
    rooms.push(roomData);
    console.log(rooms);
  });

  socket.on("join-room", (nickname, roomCode) => {
    console.log(
      `Player ${nickname} with id ${socket.id} trying to join room ${roomCode}`
    );
    const room = rooms.find((r) => r.roomId === roomCode);
    if (room) {
      socket.join(roomCode);
      room.players.push({ id: socket.id, nickname: nickname, cards: [] });
      console.log(
        `Player ${nickname} joined room ${roomCode}. Players:`,
        room.players.map((p) => p.nickname)
      );
      io.to(socket.id).emit("joined-room", room);
      io.to(roomCode).emit("room-updated", room);
      console.log(room);
    } else {
      console.log(`Room ${roomCode} not found.`);
      socket.emit("room-not-found", roomCode);
    }
  });
});

server.listen(3000, () => {
  console.log("listening on 3000");
});
