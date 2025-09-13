export default function Card({
  cardName,
  action,
  selected,
}: {
  cardName: string;
  action: (value: string) => void;
  selected: boolean;
}) {
  return (
    <div
      onClick={() => action(cardName)}
      className={`w-[100px] aspect-[1/2] bg-white h-[150px] flex justify-center items-center ${
        selected ? "border-4 border-black" : ""
      }`}
    >
      {cardName}
    </div>
  );
}
