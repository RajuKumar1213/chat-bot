import { Router } from 'express';
import { uploadDocuments } from '../controllers/upload.controller';
import { upload } from '../middlewares/multer.middleware';

const router = Router();

router.route('/documents').post(upload.array('files', 5), uploadDocuments);

export default router;
