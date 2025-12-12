import { Worker } from 'bullmq';
import fs from 'fs';
import dotenv from 'dotenv';
import { extractPdf, extractDocx, extractTxt } from '../helpers/extract';
import { chunkText } from '../helpers/chunkText';
import { getEmbedding } from '../utils/ollama-embed';
import { Vector } from '../models/VectorCollections';
import IORedis from 'ioredis';
import connectDB from '../db/index.js';

dotenv.config();
connectDB();

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '14591'),
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'document-upload',
  async (job) => {
    const { files } = job.data;
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await job.updateProgress(Math.round(((i + 1) / totalFiles) * 100));
      let text = '';

      if (file.mimetype === 'application/pdf') {
        text = await extractPdf(file.path);
      } else if (
        file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        text = await extractDocx(file.path);
      } else if (file.mimetype === 'text/plain') {
        text = extractTxt(file.path);
      } else {
        continue;
      }

      const chunks = chunkText(text);
      const embeddings: number[][] = [];

      for (const chunk of chunks) {
        const emb = await getEmbedding(chunk);
        embeddings.push(emb);
      }

      const documentId = Date.now().toString();

      await Vector.insertMany(
        chunks.map((c, i) => ({
          chunk: c,
          embedding: embeddings[i],
          documentId,
          fileName: file.originalname,
          uploadedAt: new Date(),
          index: i,
        }))
      );

      fs.unlinkSync(file.path);
    }

    await job.updateProgress(100);
    return { status: 'completed', filesProcessed: totalFiles };
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log('Job completed:', job.id);
});

worker.on('failed', (job, err) => {
  console.log('Job failed:', job?.id, err);
});
