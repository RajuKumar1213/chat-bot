import ollama from 'ollama';

export const getEmbedding = async (text: string) => {
  const response = await ollama.embeddings({
    model: 'embeddinggemma',
    prompt: text,
  });
  return response.embedding;
};
