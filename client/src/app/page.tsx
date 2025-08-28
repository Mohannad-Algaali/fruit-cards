import { io } from "socket.io-client";

export default function Home() {
  return (
    <div className="flex h-[100dvh] justify-center items-center">
      <div className="container flex-col flex w-[80%] lg:w-[60%] justify-center items-center border-4 border-primary p-10 rounded-xl gap-10 ">
        <h1 className="text-5xl font-bold">Fruits Game</h1>
        <div className="container flex flex-col justify-center items-center">
          <button className="btn btn-xl btn-primary">Host a Game</button>
        </div>
        <div className="container flex-col flex w-[80%] lg:w-[60%] justify-center items-center gap-2">
          <input
            type="text"
            className="input-xl text-2xl border-2 border-primary rounded-xl border-solid p-3"
            placeholder="Enter your name"
          />
          <input
            type="text"
            className="input-xl text-2xl border-2 border-primary rounded-xl border-solid p-3"
            placeholder="Enter the Room Code"
          />
          <button className="btn  btn-xl btn-primary">Join a Game</button>
        </div>
      </div>
    </div>
  );
}
