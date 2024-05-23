import React from "react";
import { useNavigate } from "react-router-dom"; // Import du hook useNavigate
import { useBackend } from "../useBackend";

const CreateGame: React.FC = () => {
  const navigate = useNavigate(); // Initialisation du hook useNavigate
  const { createGame } = useBackend();

  const handleCreateGame = async () => {
    try {
      await createGame();
      // Rediriger l'utilisateur vers la page de démarrage de la partie
      navigate("/start-game");
    } catch (error) {
      console.error("Erreur lors de la création du jeu :", error);
      // Gérer les erreurs ici, par exemple afficher un message d'erreur à l'utilisateur
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
