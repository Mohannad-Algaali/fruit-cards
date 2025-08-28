const PORT = 5000;
const express = require("express");
const cors = require("cors");
const io = require("socket.io")(PORT);

io.on("connection", (socket) => {
  console.log(socket.id);
});
