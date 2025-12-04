// import fetch from "node-fetch";

// export async function getEmbedding(text) {
//   const res = await fetch("http://localhost:11434/api/embeddings", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       model: "embeddinggemma",
//       input: text,
//     }),
//   });

//   const data = await res.json();

//   console.log("This is data, ", data);

//   // Ollama returns array inside data.data
//   if (!data?.data?.length) {
//     throw new Error("Failed to get embedding from Ollama");
//   }

//   return data.data[0].embedding; // <-- FIXED
// }

import ollama from "ollama";

const getEmbedding = async (text) => {
  const response = await ollama.embeddings({
    model: "embeddinggemma",
    prompt: text,
  });
  return response.embedding;
};

export default getEmbedding;
