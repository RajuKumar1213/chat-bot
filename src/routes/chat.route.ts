import { Router, Request, Response } from 'express';
import { askBot } from '../utils/chat';

const router = Router();

router.post('/ask', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const answer = await askBot(query);
    res.json({ success: true, answer });
  } catch (error) {
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : 'An error occurred',
      });
  }
});

export default router;
