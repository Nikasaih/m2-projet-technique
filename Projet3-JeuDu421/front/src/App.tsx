import React, { useState } from "react";
import CreateGame from "./pages/CreateGame";
import GameControle from "./pages/GameControle";
import Game from "./pages/Game";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GameContext, IGame } from './interface';

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
                <h1>Jeu Multijoueur</h1>
                <CreateGame />
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