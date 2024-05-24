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
    <div className="d-flex text-center mb-5">
      {/* <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Créer une nouvelle partie</h1> */}
      <button onClick={handleCreateGame} className="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700">Créer une partie</button>
    </div>
  );
};

export default CreateGame;