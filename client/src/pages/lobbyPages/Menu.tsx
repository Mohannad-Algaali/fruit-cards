import { useContext, useState, useEffect } from "react"; // Added useState, useEffect
import { RoomContext } from "../Lobby";
import type { RoomData } from "../../types/types";
import socket from "../../services/Socket";

export default function Menu({ next }: { next: () => void }) {
  const roomData = useContext<RoomData>(RoomContext);

  // Local state for sliders
  const [localTimer, setLocalTimer] = useState(roomData.timer);
  const [localCards, setLocalCards] = useState(roomData.cards);

  // Sync local state with roomData from context
  useEffect(() => {
    setLocalTimer(roomData.timer);
    setLocalCards(roomData.cards);
  }, [roomData.timer, roomData.cards]);

  const isHost = socket.id === roomData.hostID;

  const handleStartGame = () => {
    if (isHost) {
      // Emit start-game with local slider values
      socket.emit("start-game", localTimer, localCards, roomData.roomId);
    }
  };

  const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimer = Number(e.target.value);
    setLocalTimer(newTimer);
    // Optionally, emit update-room to server immediately if desired, but the request is to make it local.
    // If we want other players to see the slider move, we'd still emit.
    // For "local" working, we only update local state.
    // The server will get the final values on "start-game".
  };

  const handleCardsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCards = Number(e.target.value);
    setLocalCards(newCards);
    // Same as above, only update local state for "local" working.
  };

  return (
    <div className="w-[100dvw] h-[100dvh] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col justify-center items-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-24 w-20 h-20 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-24 left-24 w-28 h-28 bg-pink-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-16 right-16 w-16 h-16 bg-indigo-200 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="w-full max-w-4xl space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎮 Game Settings
          </h1>
          <p className="text-gray-600 text-lg">
            Configure your game and wait for players!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Players Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">👥</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Players in Room
              </h2>
            </div>

            <div className="space-y-3">
              {roomData.players.map((p, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800">
                      {p.nickname}
                    </span>
                    {p.id === roomData.hostID && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                        👑 Leader
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {roomData.players.length < 2 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">⏳</div>
                  <p>Waiting for more players...</p>
                </div>
              )}
            </div>
          </div>

          {/* Game Options Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Game Options</h2>
            </div>

            <div className="space-y-8">
              {/* Timer Setting */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⏱️</span>
                  <label className="text-lg font-semibold text-gray-700">
                    Turn Timer
                  </label>
                </div>
                <div className="px-4">
                  <input
                    type="range"
                    max={11}
                    min={2}
                    value={localTimer} // Use local state
                    onChange={handleTimerChange} // Update local state
                    className="w-full h-3 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>2s</span>
                    <span>10s</span>
                    <span>∞</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full font-semibold text-orange-800">
                    {localTimer > 10
                      ? "⏰ Unlimited Time"
                      : `⏰ ${localTimer} seconds per turn`}
                  </span>
                </div>
              </div>

              {/* Cards Setting */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🃏</span>
                  <label className="text-lg font-semibold text-gray-700">
                    Cards per Player
                  </label>
                </div>
                <div className="px-4">
                  <input
                    type="range"
                    max={5}
                    min={3}
                    value={localCards} // Use local state
                    onChange={handleCardsChange} // Update local state
                    className="w-full h-3 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full font-semibold text-green-800">
                    🃏 {localCards} cards per player
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <div className="text-center">
          <button
            onClick={handleStartGame}
            disabled={!isHost}
            className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isHost ? "🚀 Start Game" : "Waiting for Host..."}
          </button>
          <p className="text-gray-500 text-sm mt-2">
            {isHost
              ? "Ready to play! (Testing mode - no minimum players required)"
              : "Only the host can start the game."}
          </p>
        </div>
      </div>
    </div>
  );
}
