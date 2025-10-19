import { type Request, type Response } from 'express';
import NodeCache from 'node-cache';

import * as s from '@/services/metrics/arts/getArtsProducersNumber.js';
import { getEndOfDayTTL } from '@/utils/getEndOfDayTTL.js';
import { internalServerError, notFound, sendJson } from '@/utils/http.js';
import logError from '@/utils/logError.js';

const artsProducersCacheTTL = getEndOfDayTTL();
const artsProducersCache = new NodeCache({
  stdTTL: artsProducersCacheTTL,
});

const getArtsProducersNumber = async (_req: Request, res: Response) => {
  const cacheKey = 'artsProducers';

  const cachedData = artsProducersCache.get(cacheKey);

  if (cachedData) return sendJson(res, cachedData);

  try {
    const metricsJson = await s.get();

    if (!metricsJson) {
      logError({
        type: 'not-found',
        controller: 'getArtsProducersNumber',
        error: 'Arts submission metrics data not found',
      });

      return notFound(res);
    }

    artsProducersCache.set(cacheKey, metricsJson);

    return sendJson(res, metricsJson);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'getArtsProducersNumber',
      error,
    });

    return internalServerError(res);
  }
};

export default getArtsProducersNumber;
