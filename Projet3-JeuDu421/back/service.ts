import { GameStatusType, IGame, IPlayer } from "./interface";
import { redisClient } from "./redisConnection";
import { fromCombinationToPoint } from "./utils";

export const saveWebsocket = async (clientId: string, ws: any) => {
  await redisClient.set(clientId, JSON.stringify(ws));
};

export const getWebsocket = async (clientId: string): Promise<WebSocket> => {
  const wsData = await redisClient.get(clientId);
  if (wsData) {
    // Convert the JSON string back to a WebSocket object
    const ws = JSON.parse(wsData);
    return ws as WebSocket;
  }
  throw new Error("no ws available for this clientId");
};

const notifyPlayer = (players: IPlayer[], msg: string) => {
  players.forEach(async (player) => {
    const ws = await getWebsocket(player.id);
    ws.send(msg);
  });
};
/** only the creator of the game can start it */
export const startGame = async (clientId: string, gameId: string) => {
  const game = await getGameById(gameId);
  if (game.players[0].id === clientId) {
    game.status = GameStatusType.PLAYING_CHARGE;
    await redisClient.set(gameId, JSON.stringify(game));
  }
  throw new Error("you must be the game master to start it");
};
export const createGame = async (clientId: string) => {
  const newGame: IGame = {
    players: [{ id: clientId, point: 0 }],
    status: GameStatusType.PLAYING_CHARGE,
    gameId: `${Date.now()}`,
    playerIdToPlay: clientId,
    pot: 21,
  };

  await redisClient.set(newGame.gameId, JSON.stringify(newGame));

  return newGame;
};
/** only the creator of the game can stop it */
export const cancelGame = async (clientId: string, gameId: string) => {
  const game = await getGameById(gameId);
  if (game.players[0].id === clientId) {
    game.status = GameStatusType.CANCELED;
    await redisClient.set(gameId, JSON.stringify(game));
  }
  throw new Error("you must be the game master to cancel it");
};
const getGameById = async (gameId: string): Promise<IGame> => {
  const gameAsJson = await redisClient.get(gameId);
  if (gameAsJson === null) {
    throw new Error("game not found");
  }
  return JSON.parse(gameAsJson);
};

export const listGame = async () => {
  const keys = await redisClient.keys("*");
  if (keys.length === 0) {
    throw new Error("no game found");
  }
  return await redisClient.mGet(keys);
};

/** join the game and notify the other player that a new player join the party */
export const joinGame = async (clientId: string, gameId: string) => {
  const game = await getGameById(gameId);
  game.players.push({ id: clientId, point: 0 });
  await redisClient.set(gameId, JSON.stringify(game));
  notifyPlayer(game.players, `new player:${clientId}`);
  return game;
};
export const quitGame = async (clientId: string, gameId: string) => {
  const game = await getGameById(gameId);
  if (game.players[0].id === clientId) {
    throw new Error(
      "you can't quit a game you've created but you can cancel it"
    );
  }
  game.players.filter((player) => player.id !== clientId);
  await redisClient.set(gameId, JSON.stringify(game));
  notifyPlayer(game.players, `player has quit:${clientId}`);
  return game;
};
const checkDiceOnCharge = (result: number[], clientId: string, game: IGame) => {
  let dicePoint = fromCombinationToPoint(result);
  if (game.pot >= dicePoint) {
    game.pot -= dicePoint;
  } else {
    dicePoint = game.pot;
    game.pot = 0;
  }

  for (let i = 0; game.players.length < i; i++) {
    if (game.players[i].id === clientId) {
      game.players[i].point += dicePoint;
      nextPlayer(game, i);
    }
  }

  if (game.pot === 0) {
    game.status = GameStatusType.PLAYING_DECHARGE;
  }
  redisClient.set(game.gameId, JSON.stringify(game));
  return game;
};
const nextPlayer = (game: IGame, playerIndex: number) => {
  if (game.players.length - 1 > playerIndex) {
    game.playerIdToPlay = game.players[1 + playerIndex].id;
  } else {
    game.playerIdToPlay = game.players[0].id;
  }
  return game;
};
const checkDiceOnDecharge = (
  result: number[],
  clientId: string,
  game: IGame
) => {
  let dicePoint = fromCombinationToPoint(result);

  for (let i = 0; game.players.length < i; i++) {
    if (game.players[i].id === clientId) {
      game.players[i].point -= dicePoint;
      nextPlayer(game, i);
      if (game.players[i].point <= 0) {
        game.status = GameStatusType.FINISHED;
      }
    }
  }

  redisClient.set(game.gameId, JSON.stringify(game));
  return game;
};

/** the front is the one responsible to launch the dice */
export const checkDice = async (
  result: number[],
  clientId: string,
  gameId: string
) => {
  const game = await getGameById(gameId);
  if (clientId !== game.playerIdToPlay) {
    throw new Error("it's not your turn");
  }
  if (game.status === GameStatusType.PLAYING_CHARGE) {
    return checkDiceOnCharge(result, clientId, game);
  } else if (game.status === GameStatusType.PLAYING_DECHARGE) {
    return checkDiceOnDecharge(result, clientId, game);
  } else {
    throw new Error("you should not play this game");
  }
};
