import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

interface SearchIndex {
  name: string;
  queryable?: boolean;
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri!);

// Colors
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const cyan = '\x1b[36m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

async function run() {
  try {
    console.log(`${cyan}🔌 Connecting to MongoDB…${reset}`);
    await client.connect();
    console.log(`${green}✓ Connected to MongoDB${reset}`);

    const db = client.db('chatbot_db');
    const collection = db.collection('documents');

    console.log(`${blue}⚙️  Creating vector search index…${reset}`);

    const index = {
      name: 'vector_index',
      type: 'vectorSearch',
      definition: {
        fields: [
          {
            type: 'vector',
            numDimensions: 768,
            path: 'embedding',
            similarity: 'dotProduct',
            quantization: 'scalar',
          },
        ],
      },
    };

    const result = await collection.createSearchIndex(index);
    console.log(`${green}📚 New search index "${result}" is building…${reset}`);

    console.log(
      `${yellow}⏳ Polling… Waiting for index to become queryable…${reset}`
    );

    let isQueryable = false;

    while (!isQueryable) {
      const cursor = collection.listSearchIndexes();

      for await (const indx of cursor) {
        if (indx.name === result) {
          if ((indx as SearchIndex).queryable) {
            console.log(
              `${green}🎉 Index "${result}" is now queryable!${reset}`
            );
            isQueryable = true;
          } else {
            console.log(
              `${yellow}⌛ Still building… checking again in 5s...${reset}`
            );
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }
      }
    }
  } catch (err) {
    console.log(
      `${red}❌ Error: ${err instanceof Error ? err.message : 'An error occurred'}${reset}`
    );
  } finally {
    await client.close();
    console.log(`${cyan}🔒 MongoDB connection closed.${reset}`);
  }
}

run().catch(console.dir);
