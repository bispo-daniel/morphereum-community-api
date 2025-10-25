import { type Request, type Response } from 'express';

import { raidCache } from '@/cache/index.js';
import type { Raid } from '@/models/raid/index.js';
import { raidData } from '@/services/raid/index.js';
import { internalServerError, notFound, sendJson } from '@/utils/http.js';
import logError from '@/utils/logError.js';

const getRaid = async (_req: Request, res: Response) => {
  const cacheKey = 'raidData';

  const cachedData = raidCache.get<Raid>(cacheKey);

  if (cachedData) return sendJson(res, cachedData);

  try {
    const raidJson = await raidData();

    if (raidJson === null) {
      logError({
        type: 'not-found',
        controller: 'getRaid',
        error: 'Raid data not found',
      });

      return notFound(res);
    }

    raidCache.set(cacheKey, raidJson);

    return sendJson(res, raidJson);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'getRaid',
      error,
    });

    return internalServerError(res);
  }
};

export default getRaid;
