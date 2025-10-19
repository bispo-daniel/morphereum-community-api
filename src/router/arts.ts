import { Router } from 'express';

import getArts from '@/controllers/arts/getArts.js';
import registerArt from '@/controllers/arts/registerArt.js';
import { imageHandler } from '@/middlewares/imageHandler.js';

const router = Router();

router.get('/', getArts);
router.post('/', imageHandler, registerArt);

export { router as artsRoutes };
