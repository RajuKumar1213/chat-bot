import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY! || '',
});

export const openRouterLLM = async (
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
) => {
  console.log('message', messages);

  const stream = await openRouter.chat.send({
    model: 'mistralai/devstral-2512:free',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: messages as any,
    stream: true,
  });

  return stream;
};
