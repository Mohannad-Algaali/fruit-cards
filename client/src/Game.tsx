import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Card from "./components/Card";
import { images } from "./constants/images";

export default function Game() {
  type ChosenCard = {
    name: string;
    index: number | null;
  };
  const { gameId } = useParams();
  const [selectedCard, setSelectedCard] = useState<ChosenCard>({
    name: "",
    index: null,
  });

  const fruits = [
    { name: "apple", img: images.apple },
    { name: "banana", img: images.banana },
    { name: "strawberry", img: images.strawberry },
    { name: "melon", img: images.melon },
    { name: "lemon", img: images.lemon },
    { name: "kiwi", img: images.kiwi },
  ];

  return (
    <div className="flex flex-col justify-center items-center h-[100dvh] relative">
      <header className="top-0 fixed bg-primary w-full flex flex-col justify-center items-center">
        <h1 className="text-2xl text-gray-200">
          Lobby #{gameId?.toUpperCase()}
        </h1>
      </header>
      <main className="flex flex-col h-full w-full">
        <div className="opponents bg-red-200 w-full h-full"></div>
        <div className="player-cards bg-yellow-200 w-full h-full grid grid-cols-6  justify-center items-center gap-10  max-w-[100dvw] max-h-[50%] p-10">
          {fruits.map((fruit, index) => (
            <div
              onClick={() => {
                if (
                  selectedCard.name !== fruit.name &&
                  index !== selectedCard.index
                ) {
                  setSelectedCard({ name: fruit.name, index: index });
                } else {
                  setSelectedCard({ name: "", index: null });
                }
              }}
            >
              <Card
                img={fruit.img}
                selected={
                  fruit.name === selectedCard.name &&
                  index === selectedCard.index
                }
              ></Card>
            </div>
          ))}
        </div>
        {selectedCard.index !== null && selectedCard.name !== "" && (
          <div className="absolute bottom-0 flex justify-center flex-col w-full py-2 px-10">
            <button className="btn-secondary btn btn-lg">Give</button>
          </div>
        )}
      </main>
    </div>
  );
}
