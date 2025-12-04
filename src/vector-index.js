import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db("chatbot_db");
    const collection = database.collection("documents");

    // 👇 create collection by inserting 1 dummy doc
    await collection.insertOne({
      _id: "init",
      text: "initial document",
      embedding: Array(768).fill(0),
    });

    const index = {
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            numDimensions: 768,
            path: "embedding",
            similarity: "cosine",
          },
        ],
      },
    };

    const result = await collection.createSearchIndex(index);
    console.log(`New search index named ${result} is building.`);

    console.log("Polling for index readiness...");
    let isQueryable = false;

    while (!isQueryable) {
      const cursor = collection.listSearchIndexes();

      for await (const idx of cursor) {
        if (idx.name.startsWith("vector_index")) {
          if (idx.queryable) {
            console.log(`Index ${idx.name} is ready.`);
            isQueryable = true;
          } else {
            await new Promise((r) => setTimeout(r, 3000));
          }
        }
      }
    }
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
