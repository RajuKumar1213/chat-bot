import { GoogleGenAI } from '@google/genai';

export const geminiLLM = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  //   // Convert OpenAI-style messages → Gemini format
  //   const geminiMessages = messages.map((msg) => ({
  //     role: msg.role,
  //     parts: [{ text: msg.content }],
  //   }));

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text; // <-- this is the correct accessor
};
