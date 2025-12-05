import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { getEmbedding } from './utils/ollama-embed.js';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

export async function search(query) {
  if (!client.isConnected?.()) await client.connect(); // only connect if not connected
  const db = client.db('chatbot_db');
  const collection = db.collection('documents');

  const vector = await getEmbedding(query);

  const results = await collection
    .aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: vector,
          numCandidates: 150,
          limit: 10,
        },
      },
      {
        $project: {
          text: 1,
          score: { $meta: 'vectorSearchScore' },
          _id: 1,
        },
      },
    ])
    .toArray();

  return results;
}
