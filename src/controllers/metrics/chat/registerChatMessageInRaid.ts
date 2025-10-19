import { type Request, type Response } from 'express';

import * as s from '@/services/metrics/chat/registerChatMessageInRaid.js';
import { endResponseWithCode, internalServerError } from '@/utils/http.js';
import logError from '@/utils/logError.js';
import { todayDate } from '@/utils/todayDate.js';

const registerChatMessageInRaid = async (_req: Request, res: Response) => {
  try {
    await s.register({ date: todayDate() });

    return endResponseWithCode(res, 200);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'registerChatMessageInRaid',
      error,
    });

    return internalServerError(res);
  }
};

export default registerChatMessageInRaid;
