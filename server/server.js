require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { log } = require("console");
const { randomUUID } = require("crypto");
const app = express();
const server = createServer(app);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Fruit Cards Server 🍓");
});

const io = new Server(server, {
  cors: {
    origin: "*", //[process.env.FRONTEND_ROUTE, "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

let rooms = [];

const cardTypes = [
  "apple",
  "mango",
  "strawberry",
  "banana",
  "orange",
  "grape",
  "pineapple",
  "watermelon",
  "peach",
  "cherry",
];

const createDeck = (cardTypes, numPlayers, numCards) => {
  let deck = [];
  for (let i = 0; i < numPlayers; i++) {
    for (let j = 0; j < numCards; j++) {
      deck.push({ type: cardTypes[i], id: randomUUID() });
    }
  }
  deck.push({ type: cardTypes[cardTypes.length - 1], id: randomUUID() });
  return deck;
};

function shuffle(arr) {
  var shuffled = [];
  var rand;
  while (arr.length !== 0) {
    rand = Math.floor(Math.random() * arr.length);
    shuffled.push(arr.splice(rand, 1)[0]);
  }
  return shuffled;
}

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
    turn: hostID,
    numTurns: 0,
  };
  return roomData;
};

const leaveRoom = (socket) => {
  const room = rooms.find((r) => r.players.some((p) => p.id === socket.id));
  if (room) {
    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    if (playerIndex !== -1) {
      const leavingPlayer = room.players[playerIndex];
      console.log(
        `Player ${leavingPlayer.nickname} is leaving room ${room.roomId}`
      );
      room.players.splice(playerIndex, 1);

      if (room.players.length === 0) {
        rooms = rooms.filter((r) => r.roomId !== room.roomId);
        console.log(`Room ${room.roomId} is empty and has been deleted.`);
        return;
      }

      if (leavingPlayer.id === room.hostID) {
        room.hostID = room.players[0].id;
        console.log(
          `Host left. New host is ${room.players[0].nickname} in room ${room.roomId}`
        );
      }

      io.to(room.roomId).emit("room-updated", room);
      io.to(room.roomId).emit("player-left", {
        playerId: leavingPlayer.id,
        playerName: leavingPlayer.nickname,
      });
    }
  }
};

io.on("connection", (socket) => {
  console.log(socket.id + " is connected");

  io.emit("connected", "hello ");
  socket.on("create-room", (nickname) => {
    const code = createRoomCode(4);
    socket.join(code);
    const roomData = createRoom(code, socket.id, nickname);
    socket.emit("room-created", roomData);
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
      io.to(socket.id).emit("joined-room", room); //Home
      io.to(roomCode).broadcast("room-updated", room); // Lobby
      console.log(room);
    } else {
      console.log(`Room ${roomCode} not found.`);
      socket.emit("room-not-found", roomCode);
    }
  });

  socket.on("start-game", (timerDuration, cardsNumber, roomId) => {
    const numCards = parseInt(cardsNumber, 10);
    const duration = parseInt(timerDuration, 10);

    console.log(
      `Starting game in room ${roomId} with timer ${duration} and ${numCards} cards.`
    );
    const room = rooms.find((r) => r.roomId === roomId);

    if (room) {
      const numPlayers = room.players.length;
      const deck = createDeck(cardTypes, numPlayers, numCards);
      const shuffledDeck = shuffle(deck);

      room.players[0].cards = shuffledDeck.splice(0, numCards + 1);
      for (let i = 1; i < numPlayers; i++) {
        room.players[i].cards = shuffledDeck.splice(0, numCards);
      }
      for (let i = 0; i < numPlayers; i++) {
        console.log(
          `${room.players[i].nickname} has cards : ${JSON.stringify(
            room.players[i].cards
          )}`
        );
      }

      room.deck = shuffledDeck;
      room.status = "game";
      room.timer = duration;
      room.cards = numCards;

      io.to(roomId).emit("game-started", room);
      io.to(roomId).emit("room-updated", room);
      console.log(`Game started in room ${roomId}. Updated room:`, room);
    } else {
      console.log(`Room ${roomId} not found when trying to start game.`);
      socket.emit("start-game-error", `Room ${roomId} not found.`);
    }
  });

  socket.on("pass-card", (cardId, roomId) => {
    if (!roomId) {
      console.log(`Could not find a room for socket ${socket.id}`);
      return;
    }

    const room = rooms.find((r) => r.roomId === roomId);
    if (!room) {
      console.log(`Room ${roomId} not found.`);
      return;
    }

    if (room.turn !== socket.id) {
      console.log(
        `It's not player ${socket.id}'s turn in room ${room.roomId}.`
      );
      socket.emit("not-your-turn");
      return;
    }

    const currentPlayerIndex = room.players.findIndex(
      (p) => p.id === socket.id
    );
    const currentPlayer = room.players[currentPlayerIndex];

    // Check for a winner before passing a card
    if (
      currentPlayer.cards.length > 0 &&
      currentPlayer.cards.every(
        (card) => card.type === currentPlayer.cards[0].type
      )
    ) {
      room.status = "complete";
      console.log(`Player ${currentPlayer.nickname} has won the game!`);
      io.to(room.roomId).emit("game-winner", {
        winnerId: currentPlayer.id,
        winnerNickname: currentPlayer.nickname,
        winningCardType: currentPlayer.cards[0].type,
        numTurns: room.numTurns,
      });
      io.to(room.roomId).emit("room-updated", room);
      return;
    }

    const cardIndex = currentPlayer.cards.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) {
      console.log(`Card ${cardId} not found in player ${socket.id}'s hand.`);
      return;
    }

    const [passedCard] = currentPlayer.cards.splice(cardIndex, 1);

    const nextPlayerIndex = (currentPlayerIndex + 1) % room.players.length;
    const nextPlayer = room.players[nextPlayerIndex];

    nextPlayer.cards.push(passedCard);
    room.numTurns += 1;

    let winner = null;
    for (const player of room.players) {
      if (
        player.cards.length > 0 &&
        player.cards.every((card) => card.type === player.cards[0].type)
      ) {
        winner = player;
        break;
      }
    }

    if (winner) {
      room.status = "complete";
      console.log(`Player ${winner.nickname} has won the game!`);
      io.to(room.roomId).emit("game-winner", {
        winnerId: winner.id,
        winnerNickname: winner.nickname,
        winningCardType: winner.cards[0].type,
        numTurns: room.numTurns,
      });
      io.to(room.roomId).emit("room-updated", room);
    } else {
      room.turn = nextPlayer.id;

      console.log(
        `Player ${currentPlayer.nickname} passed a card to ${nextPlayer.nickname}`
      );
      console.log(`It is now ${nextPlayer.nickname}'s turn.`);

      io.to(room.roomId).emit("room-updated", room);
    }
  });

  socket.on("update-settings", (updatedRoomData) => {
    const room = rooms.find((r) => r.roomId === updatedRoomData.roomId);

    if (room) {
      if (socket.id === room.hostID) {
        room.timer = updatedRoomData.timer;
        room.cards = updatedRoomData.cards;

        io.to(room.roomId).broadcast("room-updated", room);
        console.log(
          `Room ${room.roomId} settings updated by host. New settings:`,
          {
            timer: room.timer,
            cards: room.cards,
          }
        );
      } else {
        console.log(
          `Attempt to update settings in room ${room.roomId} by non-host ${socket.id}.`
        );
        socket.emit(
          "update-settings-error",
          "Only the host can change settings."
        );
      }
    } else {
      console.log(
        `Room with ID ${updatedRoomData.roomId} not found for settings update.`
      );
      socket.emit("update-settings-error", `Room not found.`);
    }
  });

  socket.on("go-to-menu", (roomData) => {
    if (!roomData) {
      console.log(`Could not find a room for socket ${socket.id}`);
      return;
    }

    const room = rooms.find((r) => r.roomId === roomData.roomId);
    if (!room) {
      console.log(`Room ${roomData.roomId} not found.`);
      return;
    }
    room.status = "menu";
    room.players.forEach((p) => (p.cards = []));
    room.turn = room.hostID;
    room.numTurns = 0;
    room.deck = [];
    io.to(room.roomId).emit("room-updated", room);
  });

  socket.on("leave-room", () => {
    leaveRoom(socket);
  });

  socket.on("kick-player", (playerId) => {
    const room = rooms.find((r) => r.hostID === socket.id);
    if (room) {
      const playerSocket = io.sockets.sockets.get(playerId);
      if (playerSocket) {
        playerSocket.disconnect(true);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(socket.id + " is disconnected");
    leaveRoom(socket);
  });

  socket.on("check-room", () => {
    const room = rooms.find((r) => r.players.some((p) => p.id === socket.id));
    if (room) {
      socket.emit("in-room", room);
    }
  });
});

server.listen(3000, () => {
  console.log("listening on 3000");
});
