import { Router } from 'express';

import getToken from '@/controllers/token/index.js';

const router = Router();

router.get('/', getToken);

export { router as tokenRoutes };
