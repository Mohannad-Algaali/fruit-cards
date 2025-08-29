import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Lobby from "./Lobby";
import Game from "./Game";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/lobby/:lobbyId" element={<Lobby />}></Route>
        <Route path="/game/:gameId" element={<Game />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
