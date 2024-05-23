import React from "react";
import { useBackend } from "../useBackend";

const GameControls: React.FC = () => {
  const { startGame } = useBackend();

  const handleStartGame = () => {
    startGame();
  };

  return (
    <div>
      <button onClick={handleStartGame}>Démarrer la partie</button>
    </div>
  );
};

export default GameControls;
