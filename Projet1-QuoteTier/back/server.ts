import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { redisClient } from "./redisConnection";
import {IQuote} from "./interface"
import bodyParser from "body-parser"
import cors from "cors";

// configures dotenv to work in your application
dotenv.config({path: "../.env"});
const app = express();
app.use(bodyParser.json())
app.use(cors())
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
      dislikeAmmount:0,
      likeAmmount:0 ,
    },
    comments:[],
    id:quotePrefix+Date.now()
  }
  await redisClient.set(quote.id, JSON.stringify(quote)) 
  response.status(200).send(quote);
}); 

/** like */
app.post("/like",  async (request: Request, response: Response) => {
const   quoteId =   request.body.quoteId
const quoteAsString = await redisClient.get(quoteId)
if(quoteAsString=== null){
  response.status(404).send("no quote find with this id");
}
const quote = JSON.parse(quoteAsString!)as IQuote
quote.grade.likeAmmount += 1

await redisClient.set(quote.id, JSON.stringify(quote))
response.status(200).send(quote);

})

/** dislike */
app.post("/dislike",  async (request: Request, response: Response) => {
  const   quoteId =   request.body.quoteId
  const quoteAsString = await redisClient.get(quoteId)
  if(quoteAsString=== null){
    response.status(404).send("no quote find with this id");
  }
  const quote = JSON.parse(quoteAsString!)as IQuote
  quote.grade.dislikeAmmount += 1
  
  await redisClient.set(quote.id, JSON.stringify(quote))
  response.status(200).send(quote);
  
})

/** comment */
app.post("/comment",  async (request: Request, response: Response) => {
  const   quoteId =   request.body.quoteId
  const quoteAsString = await redisClient.get(quoteId)
  if(quoteAsString=== null){
    response.status(404).send("no quote find with this id");
  }
  const quote = JSON.parse(quoteAsString!)as IQuote
  quote.comments.push (request.body.comment)
  
  await redisClient.set(quote.id, JSON.stringify(quote))
  response.status(200).send(quote);
})

app.listen(BACKEND_PORT, async () => { 
  await redisClient.connect();
  console.log("Server running at PORT: ", BACKEND_PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});