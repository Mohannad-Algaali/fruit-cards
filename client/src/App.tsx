function App() {
  return (
    <div className="flex flex-col h-[100dvh] justify-center items-center ">
      <h1 className="text-5xl font-bold">Fruit Cards</h1>
      <div className=" border-2 border-dashed border-primary rounded-2xl m-10">
        <div className=" flex flex-col gap-5 p-10">
          <input
            type="text"
            className="input-xl border-2 border-primary rounded-xl p-3 "
            placeholder="Enter Your Name"
          />
          <input
            type="text"
            className="input-xl border-2 border-primary rounded-xl p-3 "
            placeholder="Enter Room Code"
          />

          <button className="btn btn-primary">Join Room</button>

          <button className="btn btn-secondary">Host Room</button>
        </div>
      </div>
    </div>
  );
}

export default App;
