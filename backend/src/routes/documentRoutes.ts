import { Router } from 'express';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
import { parseDocument } from '../controllers/documentController.js';
import { addGenerationJob, getJobStatus } from '../controllers/generationController.js';

const router = Router();

router.post('/parse-document', uploadMiddleware.single('file'), parseDocument);
router.post('/generate', addGenerationJob);
router.get('/job-status/:jobId', getJobStatus);

export default router;
