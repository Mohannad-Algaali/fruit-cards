import React, { useState } from "react";
import type { Params } from "react-router-dom";
import Card from "../../components/Card";

type Player = { name: string; numCards: number };

export default function Game({ roomId, nickname, next }: any) {
  const cardsNumber = 3;
  const cards = ["mango", "mango", "apple", "strawberry"];
  const [selectedCard, setSelectedCard] = useState({ index: -1, name: "" });

  const players = [
    { name: "1123123", numCards: cardsNumber },
    { name: "woooow", numCards: cardsNumber + 1 },
    { name: "yummy", numCards: cardsNumber },
    { name: "yummy", numCards: cardsNumber },
    { name: "yummy", numCards: cardsNumber },
  ];

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
              key={p.name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              <div
                className={`
                flex flex-col items-center justify-center
                rounded-xl
                text-white text-center
                w-40 h-20
                sm:w-24 sm:h-24
                md:w-28 md:h-28
                shadow-lg
                ${i === turn ? "bg-yellow-500" : "bg-indigo-600"}
              `}
              >
                <span className="font-semibold text-sm sm:text-base truncate px-2">
                  {p.name}
                </span>
                <span className="text-xs sm:text-sm">{p.numCards} cards</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-[100dvh] w-[100dvw] grid grid-rows-20 grid-cols-1 ">
      <div className="bg-primary row-span-1 col-span-1 flex flex-row justify-evenly items-center text-xl text-white ">
        <h1>Room: #{roomId}</h1>
      </div>

      <div className="bg-red-200 col-span-1 row-span-12 flex justify-center items-center">
        <OpponentCircle
          players={players}
          turn={1 /* whatever logic you use */}
        />
      </div>
      <div className="bg-blue-200 col-span-1 row-span-7 flex flex-col justify-center items-center relative">
        <div
          className={`w-full gap-1 justify-center items-center flex-1 flex-row flex`}
        >
          {cards.map((card, index) => (
            <div className="col-span-1">
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
              ></Card>
            </div>
          ))}
        </div>
        {selectedCard.name !== "" && selectedCard.index >= 0 && (
          <button className="absolute bottom-2 btn btn-primary">
            Pass Card
          </button>
        )}
      </div>
      <button onClick={next} className="btn bg-primary">
        Finish game
      </button>
    </div>
  );
}
