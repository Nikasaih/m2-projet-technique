import { useState } from "react";
import { IGame } from "./interface";
import axios from "axios";
const host = "http://localhost:5000";

export const useBackend = () => {
  const [myDice, setMyDices] = useState<number[]>([]);
  const [gameList, setGameList] = useState<IGame[]>([]);
  const [currGame, setCurrGame] = useState<IGame | undefined>();
  const createGame = async () => {
    const c = await axios.post(host + "/create-game");
    setCurrGame(c.data);
  };
  const startGame = () => {
    if (currGame) {
      axios.post(host + "/start-game", { gameId: currGame.gameId });
    }
  };
  const joinGame = async (gameId: string) => {
    const c = await axios.post(host + "/join-game", { gameId: gameId });

    setCurrGame(c.data);
  };
  const cancelGame = async (gameId: string) => {
    const c = await axios.post(host + "/cancel-game", { gameId: gameId });

    if (c.status === 200) {
      setCurrGame(undefined);
    }
  };
  const listGames = async () => {
    const games = await axios.get(host + "/list-games");
    setGameList(games.data);
  };
  const quitGame = async (gameId: string) => {
    const c = await axios.post(host + "/quit-game", { gameId: gameId });

    if (c.status === 200) {
      setCurrGame(undefined);
    }
  };
  const throwDice = () => {
    if (!currGame) {
      return;
    }
    const value1 = 4;
    const value2 = 2;
    const value3 = 1;

    const throwResult = [value1, value2, value3];
    setMyDices(throwResult);

    axios.post(host + "/check-dice", {
      diceResults: throwResult,
      gameId: currGame.gameId,
    });
  };

  return {
    joinGame,
    createGame,
    startGame,
    cancelGame,
    listGames,
    quitGame,
    throwDice,
    gameList,
    myDice,
  };
};
