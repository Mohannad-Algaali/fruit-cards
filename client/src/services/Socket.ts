import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connected", (text: string) => {
  console.log("connected to socket : ", text);
});

export default socket;
