import React, { useContext } from 'react';
import { useBackend } from '../useBackend';
import { GameContext } from '../interface';

const Game = () => {
  const { throwDice, myDice } = useBackend();
  const { game } = useContext(GameContext);

  const handleThrowDice = () => {
    if (game) {
      throwDice(game.gameId); 
    }
    console.log('Dice values:', myDice);
  }

  return (
    <div>
      <button onClick={handleThrowDice}>Lancer les dés</button>
      <div>Résultats : {myDice.join(', ')}</div>
      {game && <div>Game ID: {game.gameId}</div>}
    </div>
  );
};

export default Game;