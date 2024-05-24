import React, { useState } from "react";
import CreateGame from "./pages/CreateGame";
import GameControle from "./pages/GameControle";
import Game from "./pages/Game";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { GameContext, IGame } from './interface';
import { useBackend } from "./useBackend";
import JoinGame from "./pages/JoinGame";

const App: React.FC = () => {
  const [game, setGame] = useState<IGame | null>(null);  

  return (
    <GameContext.Provider value={{ game, setGame }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="text-4xl font-bold mb-8 text-center text-white-800">Jeu du 421</h1>
                <CreateGame  />
                <JoinGame />
              </>
            }
          />
          <Route path="/start-game" element={<GameControle />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </GameContext.Provider>
  );
};

export default App;