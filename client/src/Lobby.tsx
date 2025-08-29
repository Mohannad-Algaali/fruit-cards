import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Lobby() {
  const { lobbyId } = useParams();
  const [chosenMode, setChosenMode] = useState("normal");
  const navigate = useNavigate();

  const players = [
    {
      name: "ahmed",
      id: "123",
      role: "host",
    },
    {
      name: "Mohannad",
      id: "124",
      role: "player",
    },
    {
      name: "Khalid",
      id: "125",
      role: "player",
    },
  ];

  const modes = [
    { title: "Fast", value: "fast", cards: 3 },
    { title: "Normal", value: "normal", cards: 4 },
    { title: "Long", value: "long", cards: 5 },
  ];
  return (
    <div className="flex flex-col h-[100dvh] justify-center items-center space-y-10">
      <h1 className="text-4xl">Game Lobby</h1>
      <h2 className="text-3xl text-primary">#{lobbyId?.toUpperCase()}</h2>

      <div className="flex flex-col md:flex-row space-x-10 space-y-10">
        <div className=" border-2 border-primary rounded-2xl p-10 space-y-3 ">
          <h3 className="text-2xl font-bold ">Players</h3>
          <ul>
            {players.map((player, index) => (
              <li
                key={player.id}
                className={`font-bold ${
                  player.role === "host" ? "text-secondary" : ""
                }`}
              >
                {++index}.{player.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="border-2 border-primary rounded-2xl p-10 space-y-3 ">
          <h3 className="text-2xl font-bold">Modes</h3>
          <ul>
            {modes.map((mode, index) => (
              <li key={index} className="space-x-2">
                <input
                  id={`radio-${mode.value}`}
                  type="radio"
                  value={mode.value}
                  onChange={(e) => setChosenMode(e.target.value)}
                  checked={mode.value === chosenMode}
                />
                <label className="text-xl " htmlFor={`radio-${mode.value}`}>
                  {mode.title}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <br />
      </div>
      <button className="btn">Invite </button>

      <div
        className="btn btn-primary"
        onClick={() => navigate("/game/" + lobbyId)}
      >
        Start Game
      </div>
    </div>
  );
}
