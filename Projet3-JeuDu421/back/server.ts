import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { redisClient } from "./redisConnection";
import bodyParser from "body-parser"
import cors from "cors";
import expressWs from "express-ws"
import { saveWebsocket } from "./service";
import { appRoute } from "./route";

// configures dotenv to work in your application
dotenv.config({path: "../.env"});
const app = express();
app.use(bodyParser.json())
app.use(cors())
const appWs = expressWs(app)

const BACKEND_PORT = process.env.BACKEND_PORT;

appWs.app.ws("/", (ws, req:Request)=>{
  if(req.socket.remoteAddress){
    saveWebsocket(req.socket.remoteAddress , ws)
  }
  else{
    console.error(" no remote address")
    throw new Error("no remote address")
  }
})

appRoute(app)

app.listen(BACKEND_PORT, async () => { 
  await redisClient.connect();
  console.log("Server running at PORT: ", BACKEND_PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});