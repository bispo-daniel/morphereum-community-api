import { type Request, type Response } from 'express';

import * as s from '@/services/metrics/arts/getArtsProducersTrending.js';
import { internalServerError, notFound, sendJson } from '@/utils/http.js';
import logError from '@/utils/logError.js';

const getArtsProducersTrending = async (_req: Request, res: Response) => {
  try {
    const metricsJson = await s.get();

    if (!metricsJson) {
      logError({
        type: 'not-found',
        controller: 'getArtsProducersTrending',
        error: 'Arts producers trending metrics not found',
      });

      return notFound(res);
    }

    return sendJson(res, metricsJson);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'getArtsProducersTrending',
      error,
    });

    return internalServerError(res);
  }
};

export default getArtsProducersTrending;
