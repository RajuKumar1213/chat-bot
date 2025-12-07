import { search } from './retrieve.js';
import { OpenRouter } from '@openrouter/sdk';
import dotenv from 'dotenv';
dotenv.config();

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

export const askBot = async (query: string): Promise<string> => {
  const topChunks = await search(query);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanedChunks = topChunks
    .map((chunk: any) => ({ text: chunk.text, score: chunk.score }))
    .slice(0, 4);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context = cleanedChunks.map((c: any) => c.text).join('\n\n');

  const prompt = `
      You are a domain expert AI assistant. Use ONLY the context below to answer the user.
      and if some one ask about what can you do ,then read the context and tell what user can ask question about, and If the context is missing informationsay: "I am sorry I don't have any information about that (here you can mention about the question , what user has asked.)🤷♂️!"

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

  const stream = await openRouter.chat.send({
    model: 'amazon/nova-2-lite-v1:free',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    stream: true,
    streamOptions: {
      includeUsage: true,
    },
  });

  let response = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      response += content;
      process.stdout.write(content);
    }
  }

  return response;
};
