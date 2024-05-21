import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { redisClient } from "./redisConnection";
import bodyParser from "body-parser"
import cors from "cors";
import expressWs from "express-ws"
// configures dotenv to work in your application
dotenv.config({path: "../.env"});
const app = express();
app.use(bodyParser.json())
app.use(cors())
const appWs = expressWs(app)

const BACKEND_PORT = process.env.BACKEND_PORT;

appWs.app.ws("/", (ws, req:Request)=>{
  ws.send("")
  ws.on("message", (msg)=>{
    console.log(ws)
  })
})

app.listen(BACKEND_PORT, async () => { 
  await redisClient.connect();
  console.log("Server running at PORT: ", BACKEND_PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});