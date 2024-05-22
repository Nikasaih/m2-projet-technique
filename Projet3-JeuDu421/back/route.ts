import { Express, Request, Response } from "express";
import {
  cancelGame,
  checkDice,
  createGame,
  joinGame,
  listGame,
  quitGame,
  startGame,
} from "./service";
export const appRoute = (app: Express) => {
  app.post("/create-game", async (request: Request, response: Response) => {
    const clientId = request.socket.remoteAddress;
    if (clientId) {
      const game = await createGame(clientId);
      response.status(201).send(game);
      return;
    }
    response.status(500).send("error");
  });

  app.post("/start-game", async (request: Request, response: Response) => {
    try {
      const clientId = request.socket.remoteAddress;
      if (clientId) {
        const game = await startGame(clientId, request.body.gameId);
        response.status(201).send(game);
        return;
      }
      response.status(500).send("error");
    } catch (err) {
      response.status(400).send(err);
    }
  });

  app.post("/cancel-game", async (request: Request, response: Response) => {
    try {
      const clientId = request.socket.remoteAddress;
      if (clientId) {
        const game = await cancelGame(clientId, request.body.gameId);
        response.status(200).send(game);
        return;
      }
      response.status(500).send("error");
    } catch (err) {
      response.status(400).send(err);
    }
  });

  app.post("/list-games", async (request: Request, response: Response) => {
    try {
      response.status(200).send(listGame());
    } catch {
      response.status(200).send([]);
    }
  });

  app.post("/join-game", async (request: Request, response: Response) => {
    try {
      const clientId = request.socket.remoteAddress;
      if (clientId) {
        const game = await joinGame(clientId, request.body.gameId);
        response.status(200).send(game);
        return;
      }
      response.status(500).send("error");
    } catch (err) {
      response.status(400).send(err);
    }
  });

  app.post("/quit-game", async (request: Request, response: Response) => {
    try {
      const clientId = request.socket.remoteAddress;
      if (clientId) {
        const game = await quitGame(clientId, request.body.gameId);
        response.status(200).send(game);
        return;
      }
      response.status(500).send("error");
    } catch (err) {
      response.status(400).send(err);
    }
  });

  app.post("/check-dice", async (request: Request, response: Response) => {
    try {
      const clientId = request.socket.remoteAddress;
      if (clientId) {
        const diceResult: number[] = request.body.diceResults;
        const gameId: string = request.body.gameId;
        const game = checkDice(diceResult, clientId, gameId);
        response.status(200).send(game);
        return;
      }
      response.status(500).send("error");
    } catch (err) {
      response.status(400).send(err);
    }
  });
};
