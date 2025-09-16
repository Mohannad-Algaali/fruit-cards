import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_BACKEND_ROUTE //|| "http://localhost:3000"
);

socket.on("connected", (text: string) => {
  console.log("connected to socket : ", text);
});

export default socket;
