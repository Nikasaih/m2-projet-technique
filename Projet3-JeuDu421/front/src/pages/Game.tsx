import React, { useContext } from 'react';
import { useBackend } from '../useBackend';
import { GameContext } from '../interface';
import Dice from '../components/Dice';
import { useNavigate } from 'react-router-dom';

const Game = () => {
  const { throwDice, myDice, cancelGame, quitGame } = useBackend();
  const navigate = useNavigate();
  const { game } = useContext(GameContext);

  const handleThrowDice = () => {
    if (game) {
      throwDice(game.gameId); 
    }
    console.log('Dice values:', myDice);
  }

  const handleQuitGame = () => {
    if (game) {
        cancelGame(game.gameId);
        quitGame(game.gameId);
        navigate("/");
    }
  };

  return game ? (
    <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Game Dashboard</h1>
        {/* <button onClick={handleThrowDice}>Lancer les dés</button> */}
        {/* <Dice values={myDice} /> */}
        {/* <div>Résultats : {myDice.join(', ')}</div> */}
        {/* {game && <div>Game ID: {game.gameId}</div>} */}
        <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Game ID : {game && game.gameId}</h2>
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={handleQuitGame}
                className="bg-yellow-600 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-700"
              >
                Quit Game
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Players</h2>
            <ul className="space-y-2">
              {game && game.players.map((player) => (
                <li key={player.id} className="bg-white text-gray-800 shadow-md rounded px-4 py-2">
                  {player.id} - {player.point} points
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8 text-center">
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Dice Results</h2>
              <Dice values={myDice} />
            </div>
            <button
              onClick={handleThrowDice}
              className="bg-blue-600 text-white font-semibold py-2 px-4 hover:bg-blue-700"
            >
              Throw Dice
            </button>
          </div>
    </div>
  ) : (<p>Vous devez démarrer une partie pour jouuer !</p>);
};

export default Game;