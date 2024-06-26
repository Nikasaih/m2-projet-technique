"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
exports.redisClient = (0, redis_1.createClient)({
    socket: {
        port: Number(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST
    },
});
exports.redisClient.on('error', err => console.log('Redis Client Error', err));
