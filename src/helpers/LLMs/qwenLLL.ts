import ollama from 'ollama';

export const qwenLLM = async (prompt: string) => {
  // Convert messages into a single prompt (Ollama doesn't support role-based messages directly)
  // const prompt = messages
  //   .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
  //   .join('\n');

  const response = await ollama.chat({
    model: 'qwen2.5:3b',
    messages: [{ role: 'user', content: prompt }],
  });

  return response.message.content; // EXACT behaviour like your openRouterLLM
};
