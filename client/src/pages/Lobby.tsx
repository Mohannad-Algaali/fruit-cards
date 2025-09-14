import { useEffect, useState, createContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import Menu from "./lobbyPages/Menu";
import Game from "./lobbyPages/Game";
import Complete from "./lobbyPages/Complete";
import type { RoomData } from "../types/types";
import socket from "../services/Socket";

export const RoomContext = createContext<any>({});

export default function Lobby() {
  const location = useLocation();
  const { data } = location.state;

  const [roomData, setRoomData] = useState<RoomData>(data);
  const [gamePhase, setGamePhase] = useState("menu");

  useEffect(() => {
    console.log("Initial room data:", data);

    const handleRoomUpdate = (updatedRoomData: RoomData) => {
      console.log("Room updated:", updatedRoomData);
      setRoomData(updatedRoomData);
    };

    const handleGameStarted = (updatedRoomData: RoomData) => {
      console.log("Game started! Switching to game view.", updatedRoomData);
      setRoomData(updatedRoomData);
      startGame();
    };

    // Listen for room updates (when players join/leave)
    socket.on("room-updated", handleRoomUpdate);

    // Listen for game start to navigate
    socket.on("game-started", handleGameStarted);

    // Cleanup listener on unmount
    return () => {
      socket.off("room-updated", handleRoomUpdate);
      socket.off("game-started", handleGameStarted);
    };
  }, []);

  const { roomId } = useParams();

  const startGame = () => {
    setGamePhase("game");
  };
  const endGame = () => {
    setGamePhase("complete");
  };
  const newGame = () => {
    setGamePhase("menu");
  };

  return (
    <RoomContext.Provider value={roomData}>
      {gamePhase === "menu" && <Menu next={startGame}></Menu>}
      {gamePhase === "game" && <Game next={endGame} roomId={roomId || ""}></Game>}
      {gamePhase === "complete" && <Complete next={newGame}></Complete>}
    </RoomContext.Provider>
  );
}
