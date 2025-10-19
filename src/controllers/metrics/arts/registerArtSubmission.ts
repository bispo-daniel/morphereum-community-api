import { type Request, type Response } from 'express';
import { z } from 'zod';

import * as s from '@/services/metrics/arts/registerArtSubmission.js';
import { endResponseWithCode, internalServerError } from '@/utils/http.js';
import logError from '@/utils/logError.js';
import { todayDate } from '@/utils/todayDate.js';

const bodySchema = z.object({
  xProfile: z.string().nonempty('X profile is required'),
});

const registerArtSubmission = async (req: Request, res: Response) => {
  const result = bodySchema.safeParse(req.body);

  if (!result.success) {
    logError({
      type: 'bad-request',
      controller: 'registerArtSubmission',
      error: result.error,
    });

    return endResponseWithCode(res, 400);
  }

  const { xProfile } = result.data;

  try {
    await s.register({ xProfile, date: todayDate() });

    return endResponseWithCode(res, 200);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'registerArtSubmission',
      error,
    });

    return internalServerError(res);
  }
};

export default registerArtSubmission;
