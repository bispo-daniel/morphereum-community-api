import { type Request, type Response } from 'express';

import * as s from '@/services/metrics/raid/registerRaidAccess.js';
import { endResponseWithCode, internalServerError } from '@/utils/http.js';
import logError from '@/utils/logError.js';
import { todayDate } from '@/utils/todayDate.js';

const registerRaidAccess = async (_req: Request, res: Response) => {
  try {
    await s.register({ date: todayDate() });

    return endResponseWithCode(res, 200);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'registerRaidAccess',
      error,
    });

    return internalServerError(res);
  }
};

export default registerRaidAccess;
