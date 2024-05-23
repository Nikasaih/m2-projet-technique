import React from "react";
import CreateGame from "./pages/CreateGame";
import GameControle from "./pages/GameControle";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
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
      </Routes>
    </Router>
  );
};

export default App;
