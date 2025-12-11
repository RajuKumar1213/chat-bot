import { Router } from 'express';
import { askToBot, getChatHistory } from '../controllers/chat.controller';

const router = Router();

router.route('/ask').post(askToBot);
router.route('/history/:sessionId').get(getChatHistory);

export default router;
