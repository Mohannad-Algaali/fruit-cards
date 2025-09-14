import { useEffect, useState } from "react";
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

    socket.on("joined-room", (data: RoomData) => {
      console.log("joined room", data);
      navigate(`/lobby/${data.roomId}`, { state: { data: data } });
    });

    socket.on("room-not-found", (roomCode: string) => {
      console.log("room not found:", roomCode);
      setRoomError("Room not found. Please check the room code.");
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("room-created");
      socket.off("joined-room");
      socket.off("room-not-found");
    };
  }, []);

  const handleJoinRoom = () => {
    if (!roomCode) {
      setRoomError("Room code is required");
      return;
    }

    if (!nickname) {
      setRoomError("Nickname is required");
      return;
    }

    // Clear any previous errors
    setRoomError("");
    
    socket.emit("join-room", nickname, roomCode);
  };
  const handleCreateRoom = () => {
    socket.emit("create-room", nickname || "Player123");
  };

  return (
    <div className="min-w-[100dvw] min-h-[100dvh] bg-gradient-to-br from-emerald-50 via-orange-50 to-pink-50 flex justify-center items-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-orange-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-pink-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-green-200 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl min-h-[70dvh] w-full max-w-md flex flex-col justify-center items-center p-8 space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            🍎 Fruit Cards 🍌
          </h1>
          <p className="text-gray-600 text-lg">Collect matching fruits to win!</p>
        </div>

        {/* Form */}
        <div className="w-full space-y-6">
          {/* Nickname Input */}
          <div className="space-y-2">
            <label htmlFor="nickname" className="block text-sm font-semibold text-gray-700">
              Your Nickname
            </label>
            <input
              id="nickname"
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-lg placeholder-gray-400"
              placeholder="Enter your nickname..."
              onChange={(e) => setNickname(e.target.value)}
              value={nickname}
            />
          </div>

          {/* Room Code Input */}
          <div className="space-y-2">
            <label htmlFor="room" className="block text-sm font-semibold text-gray-700">
              Room Code
            </label>
            <input
              id="room"
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-lg placeholder-gray-400 text-center tracking-widest"
              placeholder="XXXX"
              maxLength={4}
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value);
              }}
            />
            {roomError && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <span>⚠️</span>
                <span>{roomError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          <button
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            onClick={handleJoinRoom}
            disabled={!roomCode || !nickname}
          >
            🚪 Join Room
          </button>
          <button
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            onClick={handleCreateRoom}
            disabled={!nickname}
          >
            ✨ Create New Room
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>🎮 Real-time multiplayer fun!</p>
        </div>
      </div>
    </div>
  );
}
