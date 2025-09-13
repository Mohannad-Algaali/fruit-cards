import React, { useEffect, useState, createContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import Menu from "./lobbyPages/Menu";
import Game from "./lobbyPages/Game";
import Complete from "./lobbyPages/Complete";
import type { RoomData } from "../types/types";

export const RoomContext = createContext<any>({});

export default function Lobby() {
  const location = useLocation();
  const { data } = location.state;

  const [roomData, setRoomData] = useState<RoomData>(data);

  useEffect(() => {
    console.log("unstateful: " + data + "room data: " + roomData);
  }, []);

  const { roomId } = useParams();

  const startGame = () => {
    // setGamePhase("game");
  };
  const endGame = () => {
    // setGamePhase("complete");
  };
  const newGame = () => {
    // setGamePhase("menu");
  };

  return (
    <RoomContext.Provider value={roomData}>
      {roomData?.status === "menu" && <Menu next={startGame}></Menu>}
      {roomData?.status === "game" && (
        <Game next={endGame} roomId={roomId}></Game>
      )}
      {roomData?.status === "complete" && <Complete next={newGame}></Complete>}
    </RoomContext.Provider>
  );
}
