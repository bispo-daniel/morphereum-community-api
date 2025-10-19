import { Router } from 'express';

import getLinks from '@/controllers/links/index.js';

const router = Router();

router.get('/', getLinks);

export { router as linksRoutes };
