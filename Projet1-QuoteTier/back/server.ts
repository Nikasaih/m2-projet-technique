import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { redisClient } from "./redisConnection";
import {IQuote} from "./interface"
import bodyParser from "body-parser"
// configures dotenv to work in your application
dotenv.config({path: "../.env"});
const app = express();
app.use(bodyParser.json())
const quotePrefix = "quote"
const BACKEND_PORT = process.env.BACKEND_PORT;

/** get all quotes */
app.get("/quotes", async (request: Request, response: Response) => {
const keys = await redisClient.keys("*");
const values = await redisClient.mGet(keys)
  response.status(200).send(values);
}); 

/** upsert one quote */
app.post("/quotes", async (request: Request, response: Response) => { 
  const quote:IQuote={
    author : request.body.author,
    quote: request.body.quote,
    grade: {
      average:undefined,
      comments:[]
    },
    id:quotePrefix+Date.now()
  }
  await redisClient.set(quote.id, JSON.stringify(quote)) 
  response.status(200).send(quote);
}); 

/**upsert one comment */
app.post("/comment", (request: Request, response: Response) => { 
  response.status(200).send("Hello World");
}); 

app.listen(BACKEND_PORT, async () => { 
  await redisClient.connect();
  console.log("Server running at PORT: ", BACKEND_PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});