import { useContext } from "react";
import { RoomContext } from "../Lobby";
import socket from "../../services/Socket";
import type { RoomData } from "../../types/types";
// Define WinnerInfo type based on server payload (copied from Lobby.tsx)
type WinnerInfo = {
  winnerId: string;
  winnerNickname: string;
  winningCardType: string;
  numTurns: number;
};

export default function Complete({
  next,
  winnerInfo,
}: {
  next: () => void;
  winnerInfo: WinnerInfo | null;
}) {
  const roomData: RoomData = useContext(RoomContext);

  return (
    <div className="h-[100dvh] w-[100dvw] bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex justify-center items-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-orange-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-red-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-pink-200 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl max-w-sm sm:max-w-md w-full flex flex-col justify-center items-center p-4 sm:p-8 space-y-6 sm:space-y-8 relative z-10">
        {/* Celebration Animation */}
        <div className="text-center space-y-4">
          <div className="text-7xl sm:text-8xl animate-bounce">🎉</div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Game Over!
          </h1>
        </div>

        {/* Winner Announcement */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg sm:text-xl">👑</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {winnerInfo?.winnerNickname || "Player"}
              </span>
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-gray-600">has won the game!</p>
        </div>

        {/* Game Stats */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 w-full">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl sm:text-2xl">🃏</span>
              <span className="text-base sm:text-lg font-semibold text-gray-700">
                Game Statistics
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">
                  {winnerInfo?.numTurns || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Total Turns
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-emerald-600">
                  {winnerInfo?.winningCardType === "apple" && "🍎"}
                  {winnerInfo?.winningCardType === "banana" && "🍌"}
                  {winnerInfo?.winningCardType === "orange" && "🍊"}
                  {winnerInfo?.winningCardType === "strawberry" && "🍓"}
                  {winnerInfo?.winningCardType === "grape" && "🍇"}
                  {winnerInfo?.winningCardType === "mango" && "🥭"}
                  {winnerInfo?.winningCardType === "pineapple" && "🍍"}
                  {winnerInfo?.winningCardType === "watermelon" && "🍉"}
                  {winnerInfo?.winningCardType === "peach" && "🍑"}
                  {winnerInfo?.winningCardType === "cherry" && "🍒"}
                  {!winnerInfo?.winningCardType && "❓"}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Winning Fruit
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 sm:space-y-4">
          <button
            onClick={next}
            disabled={socket.id !== roomData?.hostID}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg sm:text-xl rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎮 Play Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full py-2 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
