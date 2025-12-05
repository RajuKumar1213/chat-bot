import fs from "fs";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { getEmbedding } from "./utils/ollama-embed.js";

dotenv.config();
const client = new MongoClient(process.env.MONGODB_URI);

// Color styling for console logs
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const cyan = "\x1b[36m";
const red = "\x1b[31m";
const reset = "\x1b[0m";

function chunkText(text, chunkSize = 300) {
  const words = text.split(" ");
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
}

async function run() {
  try {
    console.log(`${cyan}🔌 Connecting to MongoDB…${reset}`);
    await client.connect();
    console.log(`${green}✓ Connected to database${reset}`);

    const db = client.db("chatbot_db");
    const collection = db.collection("documents");

    // const bigText = fs.readFileSync("./src/big-doc.txt", "utf8");
    const bigText = fs.readFileSync("./src/docs/alok.txt", "utf8");
    const chunks = chunkText(bigText);

    console.log(`${yellow}📦 Total Chunks to Insert: ${chunks.length}${reset}`);
    console.log(`${cyan}🚀 Starting insertion…${reset}`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const embedding = await getEmbedding(chunk);

      await collection.insertOne({
        text: chunk,
        embedding,
      });

      console.log(`${green}✔ Inserted chunk ${i + 1}/${chunks.length}${reset}`);
    }

    console.log(`${cyan}🎉 All chunks inserted successfully!${reset}`);
  } catch (error) {
    console.log(`${red}❌ Error: ${error.message}${reset}`);
  } finally {
    await client.close();
    console.log(`${yellow}🔒 MongoDB connection closed${reset}`);
  }
}

run();
