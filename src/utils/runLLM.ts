import { OpenRouter } from '@openrouter/sdk';
import { search } from './retrieve';
import { genzPrompts } from '../config/prompts';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY! || '',
});

export const runLLM = async (query: string) => {
  const topChunks = await search(query);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanedChunks = topChunks.map((chunk: any) => ({
    text: chunk.text,
    score: chunk.score,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context = cleanedChunks.map((c: any) => c.text).join('\n\n');

  const prompt = genzPrompts(context, query);

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
