import { useEffect, useState, createContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Menu from "./lobbyPages/Menu";
import Game from "./lobbyPages/Game";
import Complete from "./lobbyPages/Complete";
import type { RoomData } from "../types/types";
import socket from "../services/Socket";
import { useSound } from "../hooks/useSound";

type WinnerInfo = {
  winnerId: string;
  winnerNickname: string;
  winningCardType: string;
  numTurns: number;
};

export const RoomContext = createContext<any>({});

export default function Lobby() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const [roomData, setRoomData] = useState<RoomData | null>(data);
  const [gamePhase, setGamePhase] = useState("menu");
  const [winnerInfo, setWinnerInfo] = useState<WinnerInfo | null>(null);
  const joinSound = useSound("/sound/player_join.mp3");
  const cardSound = useSound("/sound/card_pass.mp3");
  const winSound = useSound("/sound/game_win.mp3");
  const startSound = useSound("/sound/game_start.mp3");

  useEffect(() => {
    if (!roomData) {
      navigate("/");
      return;
    }

    const handleRoomUpdate = (updatedRoomData: RoomData) => {
      console.log("Room updated:", updatedRoomData);
      if (updatedRoomData.players.length < roomData.players.length) {
        // Player left
      } else if (updatedRoomData.players.length > roomData.players.length) {
        joinSound.play();
      } else if (
        JSON.stringify(updatedRoomData.players) !==
        JSON.stringify(roomData.players)
      ) {
        cardSound.play();
      }

      const playerInRoom = updatedRoomData.players.find(
        (p) => p.id === socket.id
      );
      if (!playerInRoom) {
        navigate("/");
      }

      if (updatedRoomData.status === "menu") {
        setGamePhase(updatedRoomData.status);
      }

      setRoomData(updatedRoomData);
    };

    const handleGameStarted = (updatedRoomData: RoomData) => {
      console.log("Game started! Switching to game view.", updatedRoomData);
      setRoomData(updatedRoomData);
      setGamePhase("game");
      startSound.play();
    };

    const handleGameWinner = (winnerData: WinnerInfo) => {
      console.log("Game over! Winner:", winnerData);
      setWinnerInfo(winnerData);
      setGamePhase("complete");
      winSound.play();
    };

    const handlePlayerLeft = ({
      PlayerId,
      PlayerName,
    }: {
      PlayerId: string;
      PlayerName: string;
    }) => {
      console.log(`player ${PlayerName} ID: ${PlayerId} left the game :(`);
    };

    socket.on("room-updated", handleRoomUpdate);
    socket.on("game-started", handleGameStarted);
    socket.on("game-winner", handleGameWinner);
    socket.on("player-left", handlePlayerLeft);

    return () => {
      socket.off("room-updated", handleRoomUpdate);
      socket.off("game-started", handleGameStarted);
      socket.off("game-winner", handleGameWinner);
    };
  }, [roomData, navigate]);

  const { roomId } = useParams();

  const startGame = () => {
    setGamePhase("game");
  };
  const endGame = () => {
    setGamePhase("complete");
  };
  const newGame = () => {
    if (roomData) {
      socket.emit("go-to-menu", roomData);
    }
    setGamePhase("menu");
    setWinnerInfo(null);
  };

  if (!roomData) {
    return null; // Or a loading spinner
  }

  return (
    <RoomContext.Provider value={roomData}>
      {gamePhase === "menu" && <Menu next={startGame}></Menu>}
      {gamePhase === "game" && (
        <Game next={endGame} roomId={roomId || ""}></Game>
      )}
      {gamePhase === "complete" && (
        <Complete next={newGame} winnerInfo={winnerInfo}></Complete>
      )}
    </RoomContext.Provider>
  );
}
