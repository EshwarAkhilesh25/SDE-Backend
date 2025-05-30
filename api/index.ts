import dotenv from 'dotenv';
import connectDB from '../src/config/db';
import { connectRedis } from '../src/config/redis';
import app from '../src/app';
import { Request, Response } from 'express';

let isConnected = false;

export default async function handler(req: Request, res: Response) {
  if (!isConnected) {
    await connectDB();
    await connectRedis();
    isConnected = true;
  }
  app(req, res);
} 