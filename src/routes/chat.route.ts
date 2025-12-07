import { Router } from 'express';
import { askToBot } from '../controllers/chat.controller';

const router = Router();

router.route('/ask').post(askToBot);

export default router;
