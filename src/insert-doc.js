import fs from 'fs';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { getEmbedding } from './utils/ollama-embed.js';

dotenv.config();
const client = new MongoClient(process.env.MONGODB_URI);

function chunkText(text, chunkSize = 300) {
  const words = text.split(' ');
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
}

async function run() {
  await client.connect();
  const db = client.db('chatbot_db');
  const collection = db.collection('documents');

  const bigText = fs.readFileSync('./src/big-doc.txt', 'utf8');
  const chunks = chunkText(bigText);

  console.log('Chunks:', chunks.length);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const embedding = await getEmbedding(chunk);

    await collection.insertOne({
      text: chunk,
      embedding,
    });

    console.log(`Inserted chunk ${i + 1}/${chunks.length}`);
  }

  await client.close();
}

run();
