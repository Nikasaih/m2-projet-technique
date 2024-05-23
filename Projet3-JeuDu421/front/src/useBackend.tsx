import { useState } from "react";
import { IGame } from "./interface";

export const useBackend = () => {
  const [myDice, setMyDices] = useState<number[]>([]);
  const [gameList, setGameList] = useState<IGame[]>([]);
  const createGame = () => {};
  const startGame = () => {};
  const joinGame = () => {};
  const cancelGame = () => {};
  const listGames = () => {};
  const quitGame = () => {};
  const throwDice = () => {
    const value1 = 4;
    const value2 = 2;
    const value3 = 1;

    setMyDices([value1, value2, value3]);
  };

  return {
    joinGame,
    createGame,
    startGame,
    cancelGame,
    listGames,
    quitGame,
    throwDice,
    games: gameList,
    myDice,
  };
};
