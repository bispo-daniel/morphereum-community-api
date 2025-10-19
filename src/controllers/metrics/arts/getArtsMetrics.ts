import { type Request, type Response } from 'express';
import NodeCache from 'node-cache';

import * as s from '@/services/metrics/arts/getArtsMetrics.js';
import { getEndOfDayTTL } from '@/utils/getEndOfDayTTL.js';
import { internalServerError, notFound, sendJson } from '@/utils/http.js';
import logError from '@/utils/logError.js';
import { yesterdayDate } from '@/utils/yesterdayDate.js';

const artsMetricsCacheTTL = getEndOfDayTTL();
const artsMetricsCache = new NodeCache({
  stdTTL: artsMetricsCacheTTL,
});

const getArtsMetrics = async (_req: Request, res: Response) => {
  const cacheKey = 'artsMetrics';

  const cachedData = artsMetricsCache.get(cacheKey);

  if (cachedData) return sendJson(res, cachedData);

  try {
    const metricsJson = await s.get({ date: yesterdayDate() });

    if (!metricsJson) {
      logError({
        type: 'not-found',
        controller: 'getArtsMetrics',
        error: 'Arts submission metrics data not found',
      });

      return notFound(res);
    }

    artsMetricsCache.set(cacheKey, metricsJson);

    return sendJson(res, metricsJson);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'getArtsMetrics',
      error,
    });

    return internalServerError(res);
  }
};

export default getArtsMetrics;
