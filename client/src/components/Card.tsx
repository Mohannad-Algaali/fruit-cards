interface CardProps {
  img: string;
  selected: boolean;
}

export default function Card(props: CardProps) {
  const { img, selected } = props;
  return (
    <div
      className={`bg-gray-100 border-${
        selected ? "4" : "2"
      } select-none border-black rounded-lg aspect-[5/7] min-w-[100px] max-w-[100px] lg:min-w-[150px] lg:max-w-[150px] flex justify-center items-center`}
    >
      <img src={img} alt="" className="w-full cover" />
    </div>
  );
}
