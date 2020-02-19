import {Router} from 'express';
import multer from 'multer';
import { signIn, getTest } from '../controllers/auth.controller';

const router = Router();

router.post('/sign_in', signIn);
router.get('/sign_in',getTest);
export default router;