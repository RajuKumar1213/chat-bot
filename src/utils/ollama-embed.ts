import ollama from 'ollama';

export const getEmbedding = async (text: string) => {
  const green = '\x1b[32m';
  const yellow = '\x1b[33m';
  const cyan = '\x1b[36m';
  const reset = '\x1b[0m';

  console.log(`${cyan}⚙️  Generating embedding for text...${reset}`);
  console.log(`${yellow}⏳ Processing…${reset}`);

  try {
    const response = await ollama.embeddings({
      model: 'embeddinggemma',
      prompt: text,
    });

    console.log(`${green}✔ Embedding generated successfully!${reset}`);
    return response.embedding;
  } catch (error) {
    console.log(`\x1b[31m❌ Error while generating embedding:\x1b[0m`, error);
    throw error;
  }
};
