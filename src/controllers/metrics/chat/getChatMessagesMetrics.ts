import { type Request, type Response } from 'express';
import NodeCache from 'node-cache';

import * as s from '@/services/metrics/chat/getChatMessagesMetrics.js';
import { getEndOfDayTTL } from '@/utils/getEndOfDayTTL.js';
import { internalServerError, notFound, sendJson } from '@/utils/http.js';
import logError from '@/utils/logError.js';
import { yesterdayDate } from '@/utils/yesterdayDate.js';

const chatMessagesMetricsCacheTTL = getEndOfDayTTL();
const chatMessagesMetricsCache = new NodeCache({
  stdTTL: chatMessagesMetricsCacheTTL,
});

const getChatMessagesMetrics = async (_req: Request, res: Response) => {
  const cacheKey = 'chatMessagesMetrics';

  const cachedData = chatMessagesMetricsCache.get(cacheKey);

  if (cachedData) return sendJson(res, cachedData);

  try {
    const metricsJson = await s.get({ date: yesterdayDate() });

    if (!metricsJson) {
      logError({
        type: 'not-found',
        controller: 'getChatMessagesMetrics',
        error: 'Chat messages metrics data not found',
      });

      return notFound(res);
    }

    chatMessagesMetricsCache.set(cacheKey, metricsJson);

    return sendJson(res, metricsJson);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'getChatMessagesMetrics',
      error,
    });

    return internalServerError(res);
  }
};

export default getChatMessagesMetrics;
