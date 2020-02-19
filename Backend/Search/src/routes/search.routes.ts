import {Router} from 'express';
import {searchTrack, searchArtist, search, Test} from '../controllers/search.controller';

const router = Router();

router.post('/', Test);
router.post('/:keyword', search);
router.post('/title/:pages',searchTrack);
router.post('/artist/:pages',searchArtist);

export default router;