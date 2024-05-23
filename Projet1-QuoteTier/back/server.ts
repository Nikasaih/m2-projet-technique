import express, { Request, Response, json } from "express";
import dotenv from "dotenv";
import { redisClient } from "./redisConnection";
import { IQuote } from "./interface";
import bodyParser from "body-parser";
import cors from "cors";

// configures dotenv to work in your application
dotenv.config({ path: "../.env" });
const app = express();
app.use(bodyParser.json());
app.use(cors());
const quotePrefix = "quote";
const BACKEND_PORT = process.env.BACKEND_PORT;

/** get all quotes */
app.get("/quotes", async (request: Request, response: Response) => {
  const keys = await redisClient.keys("*");
  if (keys.length === 0) {
    response.status(200).send("no quote for the moment");
    return;
  }
  const values = await redisClient.mGet(keys);
  response.status(200).send(values);
});

/** upsert one quote */
app.post("/quotes", async (request: Request, response: Response) => {
  const quote: IQuote = {
    author: request.body.author,
    quote: request.body.quote,
    grade: {
      dislikeAmmount: 0,
      likeAmmount: 0,
    },
    comments: [],
    id: quotePrefix + Date.now(),
  };
  await redisClient.set(quote.id, JSON.stringify(quote));
  response.status(200).send(quote);
});

/** get one quote by id */
app.get("/quotes/:id", async (request: Request, response: Response) => {
  const quoteId = request.params.id;
  const quoteAsString = await redisClient.get(quoteId);
  if (quoteAsString === null) {
    response.status(404).send("No quote found with this id");
  } else {
    response.status(200).send(JSON.parse(quoteAsString));
  }
});

/** update one quote by id */
app.put("/quotes/:id", async (request: Request, response: Response) => {
  const quoteId = request.params.id;
  const updatedQuote: IQuote = {
    ...request.body,
    id: quoteId,
  };
  await redisClient.set(quoteId, JSON.stringify(updatedQuote));
  response.status(200).send(updatedQuote);
});

/** like */
app.post("/like", async (request: Request, response: Response) => {
  const quoteId = request.body.quoteId;
  const quoteAsString = await redisClient.get(quoteId);
  if (quoteAsString === null) {
    response.status(404).send("no quote find with this id");
  }
  const quote = JSON.parse(quoteAsString!) as IQuote;
  quote.grade.likeAmmount += 1;

  await redisClient.set(quote.id, JSON.stringify(quote));
  response.status(200).send(quote);
});

/** dislike */
app.post("/dislike", async (request: Request, response: Response) => {
  const quoteId = request.body.quoteId;
  const quoteAsString = await redisClient.get(quoteId);
  if (quoteAsString === null) {
    response.status(404).send("no quote find with this id");
  }
  const quote = JSON.parse(quoteAsString!) as IQuote;
  quote.grade.dislikeAmmount += 1;

  await redisClient.set(quote.id, JSON.stringify(quote));
  response.status(200).send(quote);
});

/** comment */
app.post("/comment", async (request: Request, response: Response) => {
  const quoteId = request.body.quoteId;
  const quoteAsString = await redisClient.get(quoteId);
  if (quoteAsString === null) {
    response.status(404).send("no quote find with this id");
  }
  const quote = JSON.parse(quoteAsString!) as IQuote;
  quote.comments.push(request.body.comment);

  await redisClient.set(quote.id, JSON.stringify(quote));
  response.status(200).send(quote);
});

/** get all author */
app.get("/author", async (request: Request, response: Response) => {
  try {
    const authorList = await redisClient.get("author");
    response.status(200).send(authorList);
  } catch {
    response.status(200).send({});
  }
});

app.post("/author", async (request: Request, response: Response) => {
  const authorName = request.body.authorName;
  const authorListAsJson = await redisClient.get("author");
  if (authorListAsJson) {
    const authorList: string[] = JSON.parse(authorListAsJson);
    authorList.push(authorName);

    redisClient.set("author", JSON.stringify(authorList));
    response.status(201).send(authorList);
    return;
  }
});

const setupBdd = () => {
  const authorList: string[] = ["Einstein", "Dalai Lama", "Hitler"];
  redisClient.set("author", JSON.stringify(authorList));

  const quotes: IQuote[] = [
    {
      author: "Hitler",
      quote: "Éprouver de la pitié pour les faibles va à l'encontre des lois de la nature !",
      grade: {
        dislikeAmmount: 11,
        likeAmmount: 131,
      },
      comments: ["Great quote!", "Very inspiring."],
      id: quotePrefix + "1",
    },
    {
      author: "Woody Allen",
      quote: "Le sexe entre deux personnes, c'est beau. Entre cinq personnes, c'est fantastique...",
      grade: {
        dislikeAmmount: 15,
        likeAmmount: 4,
      },
      comments: [],
      id: quotePrefix + "2",
    }
  ];

  for (const quote of quotes) {
    redisClient.set(quote.id, JSON.stringify(quote));
  }
};

app
  .listen(BACKEND_PORT, async () => {
    await redisClient.connect();
    setupBdd();
    console.log("Server running at PORT: ", BACKEND_PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
