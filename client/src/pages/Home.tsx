import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../services/Socket";
import type { RoomData } from "../types/types";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t, i18n } = useTranslation();
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
      setRoomError(t("home.roomNotFoundError"));
    });

    socket.on("in-room", (data: RoomData) => {
      console.log("already in room", data);
      navigate(`/lobby/${data.roomId}`, { state: { data: data } });
    });

    socket.emit("check-room");

    // Cleanup listeners on unmount
    return () => {
      socket.off("room-created");
      socket.off("joined-room");
      socket.off("room-not-found");
      socket.off("in-room");
    };
  }, [navigate, t]);

  const handleJoinRoom = () => {
    if (!roomCode) {
      setRoomError(t("home.roomCodeRequiredError"));
      return;
    }

    if (!nickname) {
      setRoomError(t("home.nicknameRequiredError"));
      return;
    }

    // Clear any previous errors
    setRoomError("");

    socket.emit("join-room", nickname, roomCode);
  };
  const handleCreateRoom = () => {
    socket.emit("create-room", nickname || "Player123");
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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

      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl min-h-[70dvh] w-full max-w-sm sm:max-w-md flex flex-col justify-center items-center p-4 sm:p-8 space-y-6 sm:space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            {t("home.title")}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            {t("home.subtitle")}
          </p>
        </div>

        {/* Form */}
        <div className="w-full space-y-4 sm:space-y-6">
          {/* Nickname Input */}
          <div className="space-y-2">
            <label
              htmlFor="nickname"
              className="block text-sm font-semibold text-gray-700"
            >
              {t("home.nicknameLabel")}
            </label>
            <input
              id="nickname"
              type="text"
              className="w-full px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-base sm:text-lg placeholder-gray-400"
              placeholder={t("home.nicknamePlaceholder")}
              onChange={(e) => setNickname(e.target.value)}
              value={nickname}
            />
          </div>

          {/* Room Code Input */}
          <div className="space-y-2">
            <label
              htmlFor="room"
              className="block text-sm font-semibold text-gray-700"
            >
              {t("home.roomCodeLabel")}
            </label>
            <input
              id="room"
              type="text"
              className="w-full px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-base sm:text-lg placeholder-gray-400 text-center tracking-widest"
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
        <div className="w-full space-y-3 sm:space-y-4">
          <button
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base sm:text-lg"
            onClick={handleJoinRoom}
            disabled={!roomCode || !nickname}
          >
            {t("home.joinRoomButton")}
          </button>
          <button
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base sm:text-lg"
            onClick={handleCreateRoom}
            disabled={!nickname}
          >
            {t("home.createRoomButton")}
          </button>
        </div>

        {/* Language Switcher */}
        <div className="flex space-x-4">
          <button
            onClick={() => changeLanguage("en")}
            className={`px-3 py-1 rounded-md ${
              i18n.language === "en"
                ? "bg-emerald-500 text-white"
                : "bg-gray-200"
            }`}
          >
            English
          </button>
          <button
            onClick={() => changeLanguage("ar")}
            className={`px-3 py-1 rounded-md ${
              i18n.language === "ar"
                ? "bg-emerald-500 text-white"
                : "bg-gray-200"
            }`}
          >
            العربية
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>{t("home.footer")}</p>
        </div>
      </div>
    </div>
  );
}
