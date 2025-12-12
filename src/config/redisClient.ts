import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD!,
  socket: {
    host: process.env.REDIS_HOST!,
    port: 14591,
  },
});

client.on('error', (err) => {
  console.error('🔥 Redis Error:', err);
});

let isConnected = false;

export const redis = {
  connect: async () => {
    if (!isConnected) {
      await client.connect();
      isConnected = true;
      console.log('🚀 Redis connected!');
    }
  },

  get: (key: string) => client.get(key),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (key: string, value: string, options?: any) =>
    client.set(key, value, options),

  del: (key: string) => client.del(key),
};

export const redisClient = client;
