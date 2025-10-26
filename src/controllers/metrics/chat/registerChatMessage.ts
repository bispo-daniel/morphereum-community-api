import { type Request, type Response } from 'express';

import * as s from '@/services/metrics/chat/registerChatMessage.js';
import { internalServerError, ok } from '@/utils/http.js';
import logError from '@/utils/logError.js';
import { todayDate } from '@/utils/todayDate.js';

const registerChatMessage = async (_req: Request, res: Response) => {
  try {
    await s.register({ date: todayDate() });

    return ok(res);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'registerChatMessage',
      error,
    });

    return internalServerError(res);
  }
};

export default registerChatMessage;
