import {Router} from 'express';
import multer from 'multer';
import { search } from '../controllers/search.controller'

const router = Router();

router.post('/search', search);

export default router;