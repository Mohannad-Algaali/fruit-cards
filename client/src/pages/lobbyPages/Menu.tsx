import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoomContext } from "../Lobby";
import type { RoomData } from "../../types/types";
import socket from "../../services/Socket";
import { useTranslation } from "react-i18next";

export default function Menu({ next }: { next: () => void }) {
  const roomData = useContext<RoomData>(RoomContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [localTimer, setLocalTimer] = useState(roomData.timer);
  const [localCards, setLocalCards] = useState(roomData.cards);

  useEffect(() => {
    setLocalTimer(roomData.timer);
    setLocalCards(roomData.cards);
  }, [roomData.timer, roomData.cards]);

  useEffect(() => {
    if (socket.id !== roomData.hostID) return;

    const handler = setTimeout(() => {
      const updatedRoomData = {
        ...roomData,
        timer: localTimer,
        cards: localCards,
      };
      socket.emit("update-settings", updatedRoomData);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localTimer, localCards, roomData]);

  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     socket.emit("leave-room");
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  const isHost = socket.id === roomData.hostID;

  const handleStartGame = () => {
    if (isHost) {
      socket.emit("start-game", localTimer, localCards, roomData.roomId);
    }
  };

  const handleLeaveRoom = () => {
    socket.emit("leave-room");
    navigate("/");
  };

  const handleKickPlayer = (playerId: string) => {
    if (isHost) {
      socket.emit("kick-player", playerId);
    }
  };

  const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimer = Number(e.target.value);
    setLocalTimer(newTimer);
  };

  const handleCardsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCards = Number(e.target.value);
    setLocalCards(newCards);
  };

  return (
    <div className="w-[100dvw] min-h-[100dvh] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center p-4 sm:justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-24 w-20 h-20 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-24 left-24 w-28 h-28 bg-pink-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-16 right-16 w-16 h-16 bg-indigo-200 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl space-y-6 sm:space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("menu.title")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            {t("menu.subtitle")}
          </p>

          <p className="text-4xl text-blue-500 font-bold ">
            #{roomData.roomId}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">👥</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {t("menu.playersInRoom")}
              </h2>
            </div>

            <div className="space-y-3">
              {roomData.players.map((p, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 sm:space-x-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">
                      {p.nickname}
                    </span>
                    {p.id === roomData.hostID && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                        {t("menu.leader")}
                      </span>
                    )}
                  </div>
                  {isHost && p.id !== roomData.hostID && (
                    <button
                      onClick={() => handleKickPlayer(p.id)}
                      className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs sm:text-sm"
                    >
                      {t("menu.kick")}
                    </button>
                  )}
                </div>
              ))}

              {roomData.players.length < 2 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">⏳</div>
                  <p>{t("menu.waitingForPlayers")}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⚙️</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {t("menu.gameOptions")}
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⏱️</span>
                  <label className="text-base sm:text-lg font-semibold text-gray-700">
                    {t("menu.turnTimer")}
                  </label>
                </div>
                <div className="px-4">
                  <input
                    type="range"
                    max={11}
                    min={2}
                    value={localTimer}
                    onChange={handleTimerChange}
                    disabled={!isHost}
                    className="w-full h-3 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-100 disabled:cursor-not-allowed"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-2">
                    <span>2{t("menu.timerUnit", { count: 2 })}</span>
                    <span>6{t("menu.timerUnit", { count: 10 })}</span>
                    <span>{t("menu.infiniteSymbol")}</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="inline-block px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full font-semibold text-orange-800 text-sm sm:text-base">
                    {localTimer > 10
                      ? t("menu.unlimitedTime")
                      : t("menu.secondsPerTurn", { count: localTimer })}
                  </span>
                </div>
              </div> */}

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🃏</span>
                  <label className="text-base sm:text-lg font-semibold text-gray-700">
                    {t("menu.cardsPerPlayer")}
                  </label>
                </div>
                <div className="px-4">
                  <input
                    type="range"
                    max={5}
                    min={3}
                    value={localCards}
                    onChange={handleCardsChange}
                    disabled={!isHost}
                    className="w-full h-3 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-2">
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="inline-block px-3 sm:px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full font-semibold text-green-800 text-sm sm:text-base">
                    {t("menu.cardsPerPlayerCount", { count: localCards })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={handleStartGame}
            disabled={!isHost}
            className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg sm:text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isHost ? t("menu.startGame") : t("menu.waitingForHost")}
          </button>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            {isHost ? t("menu.hostStartMessage") : t("menu.playerStartMessage")}
          </p>
        </div>
        <div className="text-center">
          <button
            onClick={handleLeaveRoom}
            className="px-6 sm:px-8 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 text-sm sm:text-base"
          >
            {t("menu.leaveRoom")}
          </button>
        </div>
      </div>
    </div>
  );
}
