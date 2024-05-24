import React, { useState, useEffect } from 'react';
import { useBackend } from '../useBackend';
import { IGame } from '../interface';
import Dice from '../components/Dice';

const Game = () => {
  const {
    joinGame,
    createGame,
    startGame,
    cancelGame,
    listGames,
    quitGame,
    throwDice,
    gameList,
    myDice,
    currGame,
  } = useBackend();

  const [gameId, setGameId] = useState('');

  useEffect(() => {
    // listGames();
  }, [currGame]);

  const handleCreateGame = async () => {
    await createGame();
  };

  const handleJoinGame = async () => {
    await joinGame(gameId);
  };

  const handleStartGame = () => {
    startGame();
  };

  const handleCancelGame = () => {
    if (currGame) {
      cancelGame(currGame.gameId);
    }
  };

  const handleQuitGame = () => {
    if (currGame) {
      quitGame(currGame.gameId);
    }
  };

  const handleThrowDice = () => {
    throwDice();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Game Dashboard</h1>

      {!currGame && (
        <>
          <div className="mb-8 flex flex-col items-center">
            <button
              onClick={handleCreateGame}
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 mb-4"
            >
              Create Game
            </button>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Game ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="border text-gray-800 border-gray-300 rounded py-2 px-4 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleJoinGame}
                className="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700"
              >
                Join Game
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Games List</h2>
            <ul className="space-y-2">
              {gameList.map((game: IGame) => (
                <li key={game.gameId} className="bg-white shadow-md rounded px-4 py-2">
                  {game.gameId}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {currGame && (
        <>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Current Game: {currGame.gameId}</h2>
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={handleStartGame}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
              >
                Start Game
              </button>
              <button
                onClick={handleCancelGame}
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700"
              >
                Cancel Game
              </button>
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
              {currGame.players.map((player) => (
                <li key={player.id} className="bg-white text-gray-800 shadow-md rounded px-4 py-2">
                  {player.id} - {player.point} points
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8 text-center">
            <button
              onClick={handleThrowDice}
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
            >
              Throw Dice
            </button>
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Dice Results:</h2>
              <Dice values={myDice} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
