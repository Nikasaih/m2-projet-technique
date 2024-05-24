import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBackend } from "../useBackend";

const GameControls: React.FC = () => {
  const navigate = useNavigate();
  const { startGame } = useBackend();

  const handleStartGame = async () => {
    try {
      await startGame();
      navigate("/game");
    } catch (error) {
      console.error("Erreur lors du démarrage de la partie :", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleStartGame}
        className="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700"
      >
        Démarrer la partie
      </button>
    </div>
  );
};

export default GameControls;
