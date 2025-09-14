import { useState, useEffect, useContext } from "react";
import Card from "../../components/Card";
import socket from "../../services/Socket";
import { RoomContext } from "../Lobby";

type Player = { name: string; numCards: number };

// Simplified types based on server code
type PlayerData = {
  id: string;
  nickname: string;
  cards: string[];
};
type RoomData = {
  roomId: string;
  hostID: string;
  players: PlayerData[];
  timer: number;
  cards: number; // cards per player
  status: string;
};

export default function Game({ roomId, next }: { roomId: string; next: () => void }) {
  const roomData = useContext<RoomData>(RoomContext);

  const [gameFruits, setGameFruits] = useState<string[]>([]);
  const [cards, setCards] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState({ index: -1, name: "" });
  const [players, setPlayers] = useState<Player[]>([]);
  const [turn, setTurn] = useState(-1);

  useEffect(() => {
    if (roomData && roomData.status === "game") {
      console.log("Populating game state from context:", roomData);

      const me = roomData.players.find((p) => p.id === socket.id);
      if (me) {
        setCards(me.cards);
      }

      const allPlayersForCircle = roomData.players.map((p) => ({
        name: p.nickname,
        numCards: p.cards.length,
      }));
      setPlayers(allPlayersForCircle);

      const startingPlayerIndex = roomData.players.findIndex(
        (p) => p.cards.length > roomData.cards
      );
      setTurn(startingPlayerIndex !== -1 ? startingPlayerIndex : 0);

      const fruitsInPlay = [
        ...new Set(roomData.players.flatMap((p) => p.cards)),
      ];
      setGameFruits(fruitsInPlay);
    }
  }, [roomData]);

  const OpponentCircle = ({
    players,
    turn, // index of the player whose turn it is
  }: {
    players: Player[];
    turn: number;
  }) => {
    const n = players.length;
    if (!n) return null;

    return (
      <div className="relative w-full h-full">
        {players.map((p, i) => {
          // angle in radians (0° = top, clockwise)
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
          // 35 % away from centre (responsive: clamp 6 rem – 12 rem)
          const radius = "clamp(5rem, 30vmin, 10rem)";
          const x = `calc(50% + ${radius}*1.1 * ${Math.cos(angle)})`;
          const y = `calc(50% + ${radius}/0.9 * ${Math.sin(angle)})`;

          return (
            <div
              key={p.name + i} // Using index in key to handle duplicate names
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              <div
                className={`
                flex flex-col items-center justify-center
                rounded-2xl
                text-white text-center
                w-32 h-20
                sm:w-28 sm:h-20
                md:w-32 md:h-24
                shadow-xl
                transform transition-all duration-300
                ${
                  i === turn
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-600 scale-110 shadow-2xl ring-4 ring-yellow-300 ring-opacity-50 animate-pulse"
                    : "bg-gradient-to-br from-indigo-500 to-indigo-700 hover:scale-105"
                }
              `}
              >
                <span className="font-bold text-sm sm:text-base truncate px-2 drop-shadow-md">
                  {p.name}
                </span>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-xs sm:text-sm">🃏</span>
                  <span className="text-xs sm:text-sm font-semibold">
                    {p.numCards}
                  </span>
                </div>
                {i === turn && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-yellow-800 text-xs">⚡</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-[100dvh] w-[100dvw] bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg flex flex-row justify-between items-center px-6 py-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm">🎮</span>
          </div>
          <h1 className="text-xl font-bold">Room: #{roomId}</h1>
        </div>

        {/* Game Fruits Indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-sm">🍎</span>
          <span className="text-sm font-semibold">Fruits in play:</span>
          <div className="flex space-x-1">
            {gameFruits.map((fruit, index) => (
              <span key={index} className="text-lg" title={fruit}>
                {fruit === "apple" && "🍎"}
                {fruit === "banana" && "🍌"}
                {fruit === "orange" && "🍊"}
                {fruit === "strawberry" && "🍓"}
                {fruit === "grape" && "🍇"}
                {fruit === "mango" && "🥭"}
                {fruit === "pineapple" && "🍍"}
                {fruit === "watermelon" && "🍉"}
                {fruit === "peach" && "🍑"}
                {fruit === "cherry" && "🍒"}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm">⏱️</span>
          <span className="text-lg font-semibold">30s</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col">
        {/* Opponents Circle */}
        <div className="flex-1 flex justify-center items-center relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-20 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
            <div className="absolute bottom-16 left-16 w-24 h-24 bg-emerald-200 rounded-full opacity-25 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-12 h-12 bg-pink-200 rounded-full opacity-30 animate-bounce"></div>
          </div>

          <OpponentCircle players={players} turn={turn} />
        </div>

        {/* Player's Cards Area */}
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-t-3xl p-6">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Your Cards
            </h2>
            <p className="text-sm text-gray-500">
              Select a card to pass to the next player
            </p>
          </div>

          <div className="flex justify-center items-center space-x-4 mb-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className="transform transition-all duration-200 hover:scale-105"
              >
                <Card
                  cardName={card}
                  selected={
                    selectedCard.name === card && selectedCard.index === index
                  }
                  action={(val: string) => {
                    if (
                      val === selectedCard.name &&
                      index === selectedCard.index
                    ) {
                      setSelectedCard({ name: "", index: -1 });
                      return;
                    }
                    setSelectedCard({ name: val, index: index });
                  }}
                />
              </div>
            ))}
          </div>

          {/* Action Button */}
          {selectedCard.name !== "" && selectedCard.index >= 0 && (
            <div className="text-center">
              <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse">
                🚀 Pass {selectedCard.name} Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Debug Button (remove in production) */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={next}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-all duration-200"
        >
          Finish Game (Debug)
        </button>
      </div>
    </div>
  );
}
