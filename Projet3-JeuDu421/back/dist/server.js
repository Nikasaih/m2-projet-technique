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
const express_ws_1 = __importDefault(require("express-ws"));
const service_1 = require("./service");
const route_1 = require("./route");
// configures dotenv to work in your application
dotenv_1.default.config({ path: "../.env" });
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const appWs = (0, express_ws_1.default)(app);
const BACKEND_PORT = process.env.BACKEND_PORT;
appWs.app.ws("/", (ws, req) => {
    if (req.socket.remoteAddress) {
        (0, service_1.saveWebsocket)(req.socket.remoteAddress, ws);
    }
    else {
        console.error(" no remote address");
        throw new Error("no remote address");
    }
});
(0, route_1.appRoute)(app);
app.listen(BACKEND_PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield redisConnection_1.redisClient.connect();
    console.log("Server running at PORT: ", BACKEND_PORT);
})).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});
