import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const generateCode = (length: number): string => {
    let code = "";
    const characters = "1234567890abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < length; i++) {
      code += characters[Math.floor(Math.random() * characters.length)];
    }

    return code;
  };
  return (
    <div className="flex flex-col h-[100dvh] justify-center items-center ">
      <h1 className="text-5xl font-bold">Fruit Cards</h1>
      <div className=" border-2 border-dashed border-primary rounded-2xl m-10">
        <div className=" flex flex-col gap-5 p-10">
          <div className="flex flex-col">
            <label htmlFor="name" className="label">
              Nickname
            </label>
            <input
              id="name"
              type="text"
              className="input-xl border-2 border-primary rounded-xl p-3 "
              placeholder="Enter Your Name"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="code" className="label">
              Room Code
            </label>
            <input
              id="code"
              type="text"
              className="input-xl border-2 border-primary rounded-xl p-3 "
              placeholder="Enter Room Code"
            />
          </div>

          <button className="btn btn-primary">Join Room</button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              navigate("lobby/" + generateCode(6));
            }}
          >
            Host Room
          </button>
        </div>
      </div>
    </div>
  );
}
