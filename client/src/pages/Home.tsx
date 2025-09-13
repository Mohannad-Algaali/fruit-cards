import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../services/Socket";
import type { RoomData } from "../types/types";

export default function Home() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [roomError, setRoomError] = useState("");

  useEffect(() => {
    socket.on("room-created", (data: RoomData) => {
      console.log("room created", data);

      navigate(`/lobby/${data.roomId}`, { state: { data: data } });
    });
  }, []);

  const handleJoinRoom = () => {
    if (!roomCode) {
      setRoomError("Room code is required");
      return;
    }
  };
  const handleCreateRoom = () => {
    socket.emit("create-room", nickname || "Player123");
  };

  return (
    <div className="min-w-[100dvw] min-h-[100dvh] bg-secondary flex justify-center items-center">
      <div className="bg-white center min-h-[60dvh] min-w-[80%] flex justify-center items-center flex-col space-y-4">
        <h1 className="text-4xl my-10">Fruit Cards</h1>

        <div className="flex-col flex">
          <label htmlFor="nickname">Nickname</label>
          <input
            id="nickname"
            type="text"
            className="input-lg input-primary border-2 rounded-lg p-2 "
            placeholder="Brown Genie"
            onChange={(e) => setNickname(e.target.value)}
            value={nickname}
          />
        </div>
        <div className="flex-col flex">
          <label htmlFor="room">Room</label>
          <input
            id="room"
            type="text"
            className="input-lg input-primary border-2 rounded-lg p-2 "
            placeholder="XXXX"
            maxLength={4}
            value={roomCode}
            onChange={(e) => {
              setRoomCode(e.target.value);
            }}
          />
          {roomError && <p className="text-red-500">! {roomError}</p>}
        </div>

        <button
          className="btn btn-primary btn-lg w-[60%] m-2 rounded-xl "
          onClick={handleJoinRoom}
        >
          Join Room
        </button>
        <button
          className="btn btn-secondary btn-lg w-[60%] m-2 rounded-xl "
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
