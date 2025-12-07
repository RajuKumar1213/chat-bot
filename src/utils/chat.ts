import { search } from './retrieve.js';
import { OpenRouter } from '@openrouter/sdk';
import dotenv from 'dotenv';
import { redis } from '../config/redisClient.js';
import { runLLM } from './runLLM.js';
dotenv.config();

export const askBot = async (query: string): Promise<string> => {
  await redis.connect();

  // caching the users query
  const cacheKey = `response:${query}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('⚡ Cache hit!');
    return cached;
  }

  console.log('⌛ Cache miss… generating response.');
  const answer = await runLLM(query);
  await redis.set(cacheKey, answer, { EX: 3600 }); // 1 hour TTL
  return answer;
};
