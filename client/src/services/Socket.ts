import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_ROUTE, {
  transports: ["polling"],
});

socket.on("connected", (text: string) => {
  console.log("connected to socket : ", text);
});

export default socket;
