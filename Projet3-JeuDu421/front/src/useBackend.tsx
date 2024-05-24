import { useCallback, useEffect, useState } from "react";
import { IGame } from "./interface";
import axios from "axios";
const port = 5000;
const httpHost = "http://localhost:" + port;
const wsHost = "ws://localhost:" + port;
export const useBackend = () => {
  const [myDice, setMyDices] = useState<number[]>([]);
  const [gameList, setGameList] = useState<IGame[]>([]);
  const [currGame, setCurrGame] = useState<IGame | undefined>();
  const createGame = async () => {
    const c = await axios.post(httpHost + "/create-game");
    console.log("Game created:", c.data);
    setCurrGame(c.data);
    return c.data;
  };
  const startGame = async () => {
    if (currGame) {
      const response = await axios.post(httpHost + "/start-game", { gameId: currGame.gameId });
      return response.data;
    }
  };
  const joinGame = async (gameId: string) => {
    const c = await axios.post(httpHost + "/join-game", { gameId: gameId });

    setCurrGame(c.data);
  };
  const cancelGame = async (gameId: string) => {
    const c = await axios.post(httpHost + "/cancel-game", { gameId: gameId });

    if (c.status === 200) {
      setCurrGame(undefined);
    }
  };
  const listGames = async () => {
    const games = await axios.get(httpHost + "/list-games");
    setGameList(games.data);
  };
  const quitGame = async (gameId: string) => {
    const c = await axios.post(httpHost + "/quit-game", { gameId: gameId });

    if (c.status === 200) {
      setCurrGame(undefined);
    }
  };
  const throwDice = (gameId: string) => {
    console.log("c'est " + gameId);
    if (!gameId) {
      return;
    }
    const value1 = Math.floor(Math.random() * 6) + 1;
    const value2 = Math.floor(Math.random() * 6) + 1;
    const value3 = Math.floor(Math.random() * 6) + 1;
  
    const throwResult = [value1, value2, value3];
    setMyDices(throwResult);
    console.log('Dice values:', throwResult);
  
    axios.post(httpHost + "/check-dice", {
      diceResults: throwResult,
      gameId: gameId,
    });
  };

  const websocket = useCallback(() => {
    const socket = new WebSocket(wsHost);
    socket.onmessage = function (event) {
      console.log("Received message:", event.data);
    };
  }, []);

  useEffect(() => {
    websocket();
  }, [websocket]);

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
    currGame,
  };
};
