export default function Card({
  cardName,
  selected,
}: {
  cardName: string;
  selected: boolean;
}) {
  // Fruit emoji mapping
  const fruitEmojis: { [key: string]: string } = {
    apple: "🍎",
    banana: "🍌",
    orange: "🍊",
    strawberry: "🍓",
    grape: "🍇",
    mango: "🥭",
    pineapple: "🍍",
    watermelon: "🍉",
    peach: "🍑",
    cherry: "🍒",
  };

  // Color themes for different fruits
  const fruitColors: { [key: string]: string } = {
    apple: "from-red-400 to-red-600",
    banana: "from-yellow-300 to-yellow-500",
    orange: "from-orange-400 to-orange-600",
    strawberry: "from-pink-400 to-red-500",
    grape: "from-purple-400 to-purple-600",
    mango: "from-yellow-400 to-orange-500",
    pineapple: "from-yellow-400 to-yellow-600",
    watermelon: "from-green-400 to-green-600",
    peach: "from-orange-300 to-pink-400",
    cherry: "from-red-500 to-red-700",
  };

  const emoji = fruitEmojis[cardName] || "🍎";
  const colorClass = fruitColors[cardName] || "from-gray-400 to-gray-600";

  return (
    <div
      className={`
        w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-44
        bg-gradient-to-br ${colorClass}
        rounded-2xl shadow-lg hover:shadow-xl
        flex flex-col justify-center items-center
        cursor-pointer transition-all duration-200
        ${selected 
          ? "ring-4 ring-yellow-400 ring-opacity-75 shadow-2xl" 
          : "hover:ring-2 hover:ring-white hover:ring-opacity-50"
        }
        relative overflow-hidden
      `}
    >
      {/* Card background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-4 right-3 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute bottom-3 left-3 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-white rounded-full"></div>
      </div>

      {/* Fruit emoji */}
      <div className="text-4xl sm:text-5xl md:text-6xl mb-2 drop-shadow-lg">
        {emoji}
      </div>

      {/* Fruit name */}
      <div className="text-white font-bold text-xs sm:text-sm capitalize drop-shadow-md">
        {cardName}
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>
      )}
    </div>
  );
}