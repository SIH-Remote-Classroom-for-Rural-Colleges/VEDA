import express from 'express';
import multer from 'multer';
import { protectRoute } from '../middleware/auth.middleware.js';
import { uploadLecture, getLectures } from '../controllers/lecture.controllers.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', protectRoute, upload.single('video'), uploadLecture);
router.get('/', getLectures);

export default router;
