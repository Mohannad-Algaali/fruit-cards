import { io } from "socket.io-client";

let userId = localStorage.getItem("userId");
if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("userId", userId);
}

const socket = io(import.meta.env.VITE_BACKEND_ROUTE, {
  auth: { userId },
});

socket.on("connected", (text: string) => {
  console.log("connected to socket : ", text);
});

export default socket;
