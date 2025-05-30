"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URI
});
exports.redisClient = redisClient;
redisClient.on('error', (err) => console.error('Redis Client Error', err));
const connectRedis = async () => {
    await redisClient.connect();
    console.log('Redis connected successfully');
};
exports.connectRedis = connectRedis;
