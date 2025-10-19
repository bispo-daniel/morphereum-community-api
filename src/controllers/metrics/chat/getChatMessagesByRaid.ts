import { type Request, type Response } from 'express';
import NodeCache from 'node-cache';

import * as s from '@/services/metrics/chat/getChatMessagesByRaid.js';
import { getEndOfDayTTL } from '@/utils/getEndOfDayTTL.js';
import { internalServerError, notFound, sendJson } from '@/utils/http.js';
import logError from '@/utils/logError.js';
import { yesterdayDate } from '@/utils/yesterdayDate.js';

const chatMessagesByRaidCacheTTL = getEndOfDayTTL();
const chatMessagesByRaidCache = new NodeCache({
  stdTTL: chatMessagesByRaidCacheTTL,
});

const getChatMessagesByRaid = async (_req: Request, res: Response) => {
  const cacheKey = 'chatMessagesByRaid';

  const cachedData = chatMessagesByRaidCache.get(cacheKey);

  if (cachedData) return sendJson(res, cachedData);

  try {
    const metricsJson = await s.get({ date: yesterdayDate() });

    if (!metricsJson) {
      logError({
        type: 'not-found',
        controller: 'getChatMessagesByRaid',
        error: 'Chat messages by raid data not found',
      });

      return notFound(res);
    }

    chatMessagesByRaidCache.set(cacheKey, metricsJson);

    return sendJson(res, metricsJson);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'getChatMessagesByRaid',
      error,
    });

    return internalServerError(res);
  }
};

export default getChatMessagesByRaid;
