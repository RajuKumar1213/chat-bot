import { search } from './retrieve';
import { formatedPrompt } from '../config/prompts';
import { cosineSimilarity } from './similarity';
import { getEmbedding } from './ollama-embed';
import { openRouterLLM } from '../helpers/LLMs/openRouter';

interface ChatHistory {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const runLLM = async (query: string, chatHistory: ChatHistory[]) => {
  // ---------- 1. Semantic follow-up detection ----------
  const queryEmbedding = await getEmbedding(query);

  let isFollowUp = false;

  for (const msg of chatHistory) {
    if (msg.role === 'user') {
      const emb = await getEmbedding(msg.content);
      const score = cosineSimilarity(queryEmbedding, emb);

      if (score > 0.6) {
        isFollowUp = true;
        break;
      }
    }
  }

  // ---------- 2. Context Retrieval ----------
  let context = '';

  if (!isFollowUp) {
    const topChunks = await search(query);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const limited = topChunks.slice(0, 3).map((chunk: any) => {
      // sirf first 150 words
      return chunk.text.split(' ').slice(0, 200).join(' ');
    });
    context = limited.join('\n\n');
  }

  // ---------- 3. Final prompt ----------

  const prompt = formatedPrompt(context, query, chatHistory);

  const messages = [{ role: 'user' as const, content: prompt }];

  const stream = await openRouterLLM(messages);
  // const response = await geminiLLM(prompt);
  // const response = await qwenLLM(prompt);

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
