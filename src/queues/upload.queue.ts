import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const connection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '14591'),
  username: 'default',
  password: process.env.REDIS_PASSWORD,
};

export const uploadQueue = new Queue('document-upload', { connection });
