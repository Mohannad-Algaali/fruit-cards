import { useEffect, useState, createContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import Menu from "./lobbyPages/Menu";
import Game from "./lobbyPages/Game";
import Complete from "./lobbyPages/Complete";
import type { RoomData } from "../types/types";
import socket from "../services/Socket";
import { useSound } from "../hooks/useSound";

// Define WinnerInfo type based on server payload
type WinnerInfo = {
  winnerId: string;
  winnerNickname: string;
  winningCardType: string; // Assuming this is added to server payload
  numTurns: number;
};

export const RoomContext = createContext<any>({});

export default function Lobby() {
  const location = useLocation();
  const { data } = location.state;

  const [roomData, setRoomData] = useState<RoomData>(data);
  const [gamePhase, setGamePhase] = useState("menu");
  const [winnerInfo, setWinnerInfo] = useState<WinnerInfo | null>(null); // New state for winner
  const joinSound = useSound("/sound/player_join.mp3");
  const cardSound = useSound("/sound/card_pass.mp3");
  const winSound = useSound("/sound/game_win.mp3");
  const startSound = useSound("/sound/turn_start.mp3");

  useEffect(() => {
    console.log("Initial room data:", data);

    const handleRoomUpdate = (updatedRoomData: RoomData) => {
      console.log("Room updated:", updatedRoomData);
      if (updatedRoomData.players.length !== roomData.players.length) {
        joinSound.play();
      } else if (
        JSON.stringify(updatedRoomData.players) !==
        JSON.stringify(roomData.players)
      ) {
        cardSound.play();
      }

      setRoomData(updatedRoomData);
    };

    const handleGameStarted = (updatedRoomData: RoomData) => {
      console.log("Game started! Switching to game view.", updatedRoomData);
      setRoomData(updatedRoomData);
      setGamePhase("game"); // Directly set gamePhase here
      startSound.play();
    };

    const handleGameWinner = (winnerData: WinnerInfo) => {
      // New handler for game-winner

      console.log("Game over! Winner:", winnerData);
      setWinnerInfo(winnerData);
      setGamePhase("complete");
      winSound.play();
    };

    // Listen for room updates (when players join/leave)
    socket.on("room-updated", handleRoomUpdate);

    // Listen for game start to navigate
    socket.on("game-started", handleGameStarted);

    // Listen for game winner
    socket.on("game-winner", handleGameWinner);

    // Cleanup listener on unmount
    return () => {
      socket.off("room-updated", handleRoomUpdate);
      socket.off("game-started", handleGameStarted);
      socket.off("game-winner", handleGameWinner); // Cleanup winner listener
    };
  }, []);

  const { roomId } = useParams();

  // startGame, endGame, newGame functions are now handled by socket events
  // and direct state updates in handlers.
  // The `next` props passed to Menu, Game, Complete will still be there,
  // but their logic will be simplified or removed if not needed for direct navigation.
  // For now, I'll keep them as they are, but the actual phase change is from socket.

  const startGame = () => {
    setGamePhase("game");
  };
  const endGame = () => {
    setGamePhase("complete");
  };
  const newGame = () => {
    socket.emit("go-to-menu", roomData);
    setGamePhase("menu");
    setWinnerInfo(null); // Clear winner info for new game
  };

  return (
    <RoomContext.Provider value={roomData}>
      {gamePhase === "menu" && <Menu next={startGame}></Menu>}
      {gamePhase === "game" && (
        <Game next={endGame} roomId={roomId || ""}></Game>
      )}
      {gamePhase === "complete" && (
        <Complete next={newGame} winnerInfo={winnerInfo}></Complete>
      )}{" "}
      {/* Pass winnerInfo */}
    </RoomContext.Provider>
  );
}
