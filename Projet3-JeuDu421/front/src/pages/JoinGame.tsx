import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBackend } from "../useBackend";
import { GameContext, IGame } from '../interface';
import Dice from "../components/Dice";

const JoinGame: React.FC = () => {
    const { joinGame, quitGame, throwDice, myDice } = useBackend();
    const { game, setGame } = useContext(GameContext);
    const [gameId, setGameId] = useState('');

    const handleJoinGame = async () => {
        await joinGame(gameId);
    };

    const handleQuitGame = () => {
        if (game) {
            quitGame(game.gameId);
        }
    };

    const handleThrowDice = () => {
        if (game) {
            throwDice(game.gameId);
        }
    };

    useEffect(() => {

    }, [game]);

    return (
        <>
            {!game && (
                <>
                    <input
                        type="text"
                        placeholder="Game ID"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                        className="border text-gray-800 border-gray-300 rounded py-2 px-4 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /><button
                            onClick={handleJoinGame}
                            className="bg-orange-600 text-white font-semibold py-2 px-4 rounded hover:bg-orange-700"
                        >
                        Rejoindre une partie
                    </button>
                </>
            )}


            {game && (
                <>
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold mb-4 text-gray-700">Current Game: {game.gameId}</h2>
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
                            {game.players.map((player) => (
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
                            {myDice ? (<Dice values={myDice} />) : (<Dice values={[0, 0, 0]} />)}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default JoinGame;