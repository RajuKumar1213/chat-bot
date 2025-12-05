import { askBot } from './chat.js';

const run = async () => {
  try {
    const res = await askBot('What Frued said about smoking cigeratte , why a person start smoking ?');
    console.log('Bot:', res);
  } catch (err) {
    console.error('Error from askBot:', err);
  }
};

run();
