import { Router } from 'express';
import {
  uploadDocuments,
  getJobStatus,
} from '../controllers/upload.controller';
import { upload } from '../middlewares/multer.middleware';

const router = Router();

router.route('/documents').post(upload.array('files', 5), uploadDocuments);
router.route('/job/:jobId').get(getJobStatus);

export default router;
