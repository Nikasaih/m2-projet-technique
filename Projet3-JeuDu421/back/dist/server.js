"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const redisConnection_1 = require("./redisConnection");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
// configures dotenv to work in your application
dotenv_1.default.config({ path: "../.env" });
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const quotePrefix = "quote";
const BACKEND_PORT = process.env.BACKEND_PORT;
/** get all quotes */
app.get("/quotes", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const keys = yield redisConnection_1.redisClient.keys("*");
    if (keys.length === 0) {
        response.status(200).send("no quote for the moment");
        return;
    }
    const values = yield redisConnection_1.redisClient.mGet(keys);
    response.status(200).send(values);
}));
/** upsert one quote */
app.post("/quotes", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const quote = {
        author: request.body.author,
        quote: request.body.quote,
        grade: {
            dislikeAmmount: 0,
            likeAmmount: 0,
        },
        comments: [],
        id: quotePrefix + Date.now()
    };
    yield redisConnection_1.redisClient.set(quote.id, JSON.stringify(quote));
    response.status(200).send(quote);
}));
/** like */
app.post("/like", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const quoteId = request.body.quoteId;
    const quoteAsString = yield redisConnection_1.redisClient.get(quoteId);
    if (quoteAsString === null) {
        response.status(404).send("no quote find with this id");
    }
    const quote = JSON.parse(quoteAsString);
    quote.grade.likeAmmount += 1;
    yield redisConnection_1.redisClient.set(quote.id, JSON.stringify(quote));
    response.status(200).send(quote);
}));
/** dislike */
app.post("/dislike", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const quoteId = request.body.quoteId;
    const quoteAsString = yield redisConnection_1.redisClient.get(quoteId);
    if (quoteAsString === null) {
        response.status(404).send("no quote find with this id");
    }
    const quote = JSON.parse(quoteAsString);
    quote.grade.dislikeAmmount += 1;
    yield redisConnection_1.redisClient.set(quote.id, JSON.stringify(quote));
    response.status(200).send(quote);
}));
/** comment */
app.post("/comment", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const quoteId = request.body.quoteId;
    const quoteAsString = yield redisConnection_1.redisClient.get(quoteId);
    if (quoteAsString === null) {
        response.status(404).send("no quote find with this id");
    }
    const quote = JSON.parse(quoteAsString);
    quote.comments.push(request.body.comment);
    yield redisConnection_1.redisClient.set(quote.id, JSON.stringify(quote));
    response.status(200).send(quote);
}));
app.listen(BACKEND_PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisConnection_1.redisClient.connect();
    console.log("Server running at PORT: ", BACKEND_PORT);
})).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});
