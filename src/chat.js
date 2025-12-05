import { search } from "./retrieve.js";
import ollama from 'ollama';

export const askBot = async (query) => {
  const topChunks = await search(query);

  // console.log(topChunks)

  // clean and limit top chunks
  const cleanedChunks = topChunks
    .map(chunk => ({ text: chunk.text, score: chunk.score }))
    .slice(0, 3); // keep top 3

  const context = cleanedChunks.map(c => c.text).join('\n\n');

  const prompt = `Use ONLY the following context to answer:

${context}

Question: ${query}
Answer:`;

  console.log('Prompt being sent:', prompt);

  const stream = await ollama.chat({
    model: 'qwen2.5:1.5b',
    messages: [{ role: 'user', content: prompt }],
    // stream: true,
  });

  // let answer = '';
  // for await (const part of stream) {
  //   const chunk = part?.message?.content ?? '';
  //   process.stdout.write(chunk);
  //   answer += chunk;
  // }

  console.log('\n');
  return stream.message.content;
};
