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
    
    // Listen for room updates (when players join/leave)
    socket.on("room-updated", (updatedRoomData: RoomData) => {
      console.log("Room updated:", updatedRoomData);
      setRoomData(updatedRoomData);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("room-updated");
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
