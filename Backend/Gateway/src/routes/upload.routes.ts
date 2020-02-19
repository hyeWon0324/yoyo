import {Router} from 'express';
import multer from 'multer';
import { uploadMusic } from '../controllers/upload.controller';
import {check} from '../middlewares/auth.middleware';
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({storage:multer.memoryStorage()});


router.post('/', check ,upload.fields([{name: 'music'}, {name: 'img'}]), uploadMusic);

export default router;