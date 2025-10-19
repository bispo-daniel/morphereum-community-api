import { Router } from 'express';

import getRaid from '@/controllers/raid/index.js';

const router = Router();

router.get('/', getRaid);

export { router as raidRoutes };
