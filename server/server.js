const PORT = 5000;
const express = require("express");
const cors = require("cors");
const io = require("socket.io")(PORT, {
  cors: {
    origin: ["*", "http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket ID: " + socket.id);
});
