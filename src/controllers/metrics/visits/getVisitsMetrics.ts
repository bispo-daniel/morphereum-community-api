import { type Request, type Response } from 'express';
import NodeCache from 'node-cache';

import * as s from '@/services/metrics/visits/getVisitsMetrics.js';
import { getEndOfDayTTL } from '@/utils/getEndOfDayTTL.js';
import { internalServerError, notFound, sendJson } from '@/utils/http.js';
import logError from '@/utils/logError.js';
import { yesterdayDate } from '@/utils/yesterdayDate.js';

const visitMetricsCacheTTL = getEndOfDayTTL();
const visitMetricsCache = new NodeCache({
  stdTTL: visitMetricsCacheTTL,
});

const getVisitsMetrics = async (_req: Request, res: Response) => {
  const cacheKey = 'visitMetrics';

  const cachedData = visitMetricsCache.get(cacheKey);

  if (cachedData) return sendJson(res, cachedData);

  try {
    const metricsJson = await s.get({ date: yesterdayDate() });

    if (!metricsJson) {
      logError({
        type: 'not-found',
        controller: 'getVisitsMetrics',
        error: 'Visits metrics data not found',
      });

      return notFound(res);
    }

    visitMetricsCache.set(cacheKey, metricsJson);

    return sendJson(res, metricsJson);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'getVisitsMetrics',
      error,
    });

    return internalServerError(res);
  }
};

export default getVisitsMetrics;
