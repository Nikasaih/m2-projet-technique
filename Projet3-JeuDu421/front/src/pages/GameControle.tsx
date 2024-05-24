import React from "react";
import { useNavigate } from "react-router-dom";
import { useBackend } from "../useBackend";

const GameControls: React.FC = () => {
  const navigate = useNavigate();
  const { startGame } = useBackend();

  const handleStartGame = () => {
    const result = startGame();
    navigate("/game");
  };

  return (
    <div>
      <button onClick={handleStartGame}>Démarrer la partie</button>
    </div>
  );
};

export default GameControls;
