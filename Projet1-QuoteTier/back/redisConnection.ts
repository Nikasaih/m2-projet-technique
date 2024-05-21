import { createClient } from 'redis';
import dotenv from "dotenv";
dotenv.config({path: "../.env"});
export const redisClient = createClient({
    socket:{
            port:Number(process.env.REDIS_PORT),
            host:process.env.REDIS_HOST
    }, 
    // username: process.env.REDIS_USER,
    // password: process.env.REDIS_PASSWORD
});

redisClient.on('error', err => console.log('Redis Client Error', err));


