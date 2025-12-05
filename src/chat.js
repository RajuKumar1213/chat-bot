import { search } from "./retrieve.js";
// import ollama from 'ollama';
import { OpenRouter } from "@openrouter/sdk";
import dotenv from "dotenv";
dotenv.config();

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

export const askBot = async (query) => {
  const topChunks = await search(query);

  // clean and limit top chunks
  const cleanedChunks = topChunks
    .map((chunk) => ({ text: chunk.text, score: chunk.score }))
    .slice(0, 4); // keep top 4 chunks

  const context = cleanedChunks.map((c) => c.text).join("\n\n");

  const prompt = `
      You are a domain expert AI assistant. Use ONLY the context below to answer the user.
      and if some one ask about what can you do ,then read the context and tell what user can ask question about, and If the context is missing informationsay: "I am sorry I don't have any information about that (here you can mention about the question , what user has asked.)🤷‍♂️!"

      Make the answer:
      - Direct and straightforward and not use any special characters. like /n or or **something** etc. I want straight forward answer.
      - and answer in genz style, like use dude , bro , fam etc.
      - Easy for a non-expert to understand
      - Well-structured (use bullet points if needed)
      - Focused strictly on the question
      - Include all relevant context details without adding anything new

      --- Context ---
      ${context}
      ----------------

      User Question: ${query}

      Final Answer:
  `;

  // Gen - Z style prompt

  //   const prompt = `
  // You are a domain-expert AI assistant with a fun, Gen-Z vibe.
  // Use ONLY the context below to answer the user.
  // If someone asks "what can you do?", read the context and tell them what topics they can ask about — nothing outside the context.
  // If the answer is not in the context, reply with: "I’m sorry, I don’t have any info on that 🤷‍♂️!"

  // When answering:
  // - Be direct and straightforward (no overthinking, king/queen)
  // - Keep the tone chill, witty, slightly sarcastic, but helpful
  // - Use simple words — pretend you're explaining to your homie
  // - Structure the answer clearly (bullet points if needed)
  // - Stick strictly to the context, no made-up lore

  // Keep it fun, but NEVER violate the “context-only” rule.

  // --- Context ---
  // ${context}
  // ----------------

  // User Question: ${query}

  // Final Answer (make it clear + funny + helpful):
  // `;

  const stream = await openRouter.chat.send({
    model: "amazon/nova-2-lite-v1:free",
    // model: "allenai/olmo-3-32b-think:free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
    streamOptions: {
      includeUsage: true,
    },
  });

  let response = "";
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      response += content;
      process.stdout.write(content);
    }
  }

  return response;
};
