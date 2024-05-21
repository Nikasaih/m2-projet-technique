import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { redisClient } from "./redisConnection";

// configures dotenv to work in your application
dotenv.config({path: "../.env"});
const app = express();

const BACKEND_PORT = process.env.BACKEND_PORT;

app.get("/", (request: Request, response: Response) => { 
  response.status(200).send("Hello World");
}); 

app.listen(BACKEND_PORT, async () => { 
  console.log("Server running at PORT: ", BACKEND_PORT); 

  await redisClient.connect();
await   redisClient.set("key", "value")

  console.log(await redisClient.get("key"))
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});