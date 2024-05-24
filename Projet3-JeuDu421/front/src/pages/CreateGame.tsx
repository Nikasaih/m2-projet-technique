import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useBackend } from "../useBackend";
import { GameContext, IGame } from '../interface';

const CreateGame: React.FC = () => {
  const navigate = useNavigate(); 
  const { createGame } = useBackend();
  const { setGame } = useContext(GameContext);

  const handleCreateGame = async () => {
    try {
      const result: IGame = await createGame();
      if (setGame) {
        setGame(result);
      }
      navigate("/start-game");
    } catch (error) {
      console.error("Erreur lors de la création du jeu :", error);
    }
  };

  return (
    <div>
      <h1>Créer une nouvelle partie</h1>
      <button onClick={handleCreateGame}>Créer une partie</button>
    </div>
  );
};

export default CreateGame;