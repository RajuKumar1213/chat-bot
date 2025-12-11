import dotenv from 'dotenv';
import { ChatHistory } from '../models/ChatHistory.js';
import { runLLM } from './runLLM.js';
import { redis } from '../config/redisClient.js';
import crypto from 'crypto';
dotenv.config();

export const askBot = async (query: string, sessionId: string) => {
  redis.connect();
  // 1. Check Redis cache
  const cacheKey = `chat:${crypto.createHash('md5').update(query.toLowerCase().trim()).digest('hex')}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return cached;
  }

  // 2. Fetch chat history from DB
  const history = await ChatHistory.find({ sessionId })
    .sort({ createdAt: 1 })
    .limit(20)
    .select('role content -_id');

  const chatHistory = history.map((h) => ({
    role: h.role,
    content: h.content,
  }));

  // 3. LLM call
  const answer = await runLLM(query, chatHistory);

  // 4. Cache the answer (1 hours)
  await redis.set(cacheKey, answer, { EX: 3600 });

  // 5. Save to DB
  await ChatHistory.insertMany([
    { sessionId, role: 'user', content: query },
    { sessionId, role: 'assistant', content: answer },
  ]);

  return answer;
};
