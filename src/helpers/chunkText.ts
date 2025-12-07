export function chunkText(text: string, chunkSize = 300) {
  const green = '\x1b[32m';
  const yellow = '\x1b[33m';
  const cyan = '\x1b[36m';
  const reset = '\x1b[0m';

  const words = text.split(' ');
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push(chunk);

    console.log(
      `${green}✔ Created chunk ${chunks.length}${reset} ` +
        `${yellow}(words ${i + 1} → ${Math.min(i + chunkSize, words.length)})${reset}`
    );
  }

  console.log(
    `${cyan}✨ Total chunks created: ${green}${chunks.length}${reset}`
  );

  return chunks;
}
