import React from "react";

export default function Complete({ next }: any) {
  return (
    <div className="h-[100dvh] w-full flex justify-center items-center flex-col space-y-8">
      <h1 className="text-4xl">Game Over</h1>
      <h2 className="text-2xl">
        <b>Player</b> has won the game
      </h2>

      <p>
        the game finished in <b>40</b> turns
      </p>
      <button onClick={next} className="btn btn-primary">
        New Game
      </button>
    </div>
  );
}
