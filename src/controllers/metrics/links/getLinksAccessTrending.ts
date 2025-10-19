import { type Request, type Response } from 'express';

import * as s from '@/services/metrics/links/getLinksAccessTrending.js';
import { internalServerError, notFound, sendJson } from '@/utils/http.js';
import logError from '@/utils/logError.js';

const getLinksAccessTrending = async (_req: Request, res: Response) => {
  try {
    const metricsJson = await s.get();

    if (!metricsJson) {
      logError({
        type: 'not-found',
        controller: 'getLinksAccessTrending',
        error: 'Link access trending metrics not found',
      });

      return notFound(res);
    }

    return sendJson(res, metricsJson);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'getLinksAccessTrending',
      error,
    });

    return internalServerError(res);
  }
};

export default getLinksAccessTrending;
