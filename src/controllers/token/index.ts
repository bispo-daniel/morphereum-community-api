import { type Request, type Response } from 'express';
import NodeCache from 'node-cache';

import { env } from '@/config/index.js';
import { tokenData } from '@/services/token/index.js';
import type { CoinMarketCapResponse } from '@/types/token.js';
import { internalServerError, notFound, sendJson } from '@/utils/http.js';
import logError from '@/utils/logError.js';

const tokenTTL = env.TOKEN_CACHE_HOURS * 3600;
const tokenCache = new NodeCache({ stdTTL: tokenTTL });

const getToken = async (_req: Request, res: Response) => {
  const cacheKey = 'tokenData';

  const cachedData = tokenCache.get<CoinMarketCapResponse>(cacheKey);

  if (cachedData) return sendJson(res, cachedData);

  try {
    const tokenJson = await tokenData();

    if (tokenJson === null) {
      logError({
        type: 'not-found',
        controller: 'getToken',
        error: 'Token data not found',
      });

      return notFound(res);
    }

    tokenCache.set(cacheKey, tokenJson);

    return sendJson(res, tokenJson);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'getToken',
      error,
    });

    return internalServerError(res);
  }
};

export default getToken;
