import React, { useState, useContext } from "react";
import { RoomContext } from "../Lobby";
import type { RoomData } from "../../types/types";
import socket from "../../services/Socket";

export default function Menu({ next }: any) {
  const roomData = useContext<RoomData>(RoomContext);

  return (
    <div className="w-[100dvw] h-[100dvh] flex flex-col justify-center items-center space-y-5">
      <h1 className="text-4xl">Menu</h1>
      <div className="border-2 p-5">
        <h2 className="text-2xl">Players</h2>
        <ul>
          {roomData.players.map((p, index) => (
            <li key={index}>
              {++index}. {p.nickname}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-2 w-[60%]">
        <h2>Options</h2>
        <div className="flex flex-col justify-center gap-2 m-5">
          <label htmlFor="time" className="label">
            Timer
          </label>
          <input
            type="range"
            max={11}
            min={2}
            value={roomData.timer}
            onChange={(e) =>
              socket.emit("update-room", {
                ...roomData,
                timer: Number(e.target.value),
              })
            }
          />
          <p>{roomData.timer > 10 ? "Unlimited" : roomData.timer} sec/turn</p>
        </div>
        <div className="flex flex-col justify-center gap-2 m-5">
          <label htmlFor="time" className="label">
            Number of Cards
          </label>
          <input
            className="accent-primary"
            type="range"
            max={5}
            min={3}
            value={roomData.cards}
            onChange={(e) =>
              socket.emit("update-room", {
                ...roomData,
                cards: Number(e.target.value),
              })
            }
          />
          <p>{roomData.cards} cards/player</p>
        </div>
      </div>
      <button onClick={next} className="btn bg-primary">
        Start game
      </button>
    </div>
  );
}
