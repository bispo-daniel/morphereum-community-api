import { type Request, type Response } from 'express';
import { z } from 'zod';

import * as s from '@/services/metrics/links/registerLinkAccess.js';
import { badRequest, internalServerError, ok } from '@/utils/http.js';
import logError from '@/utils/logError.js';
import { todayDate } from '@/utils/todayDate.js';

const bodySchema = z.object({
  linkId: z.string().nonempty('linkId is required'),
});

const registerLinkAccess = async (req: Request, res: Response) => {
  const result = bodySchema.safeParse(req.body);

  if (!result.success) {
    logError({
      type: 'bad-request',
      controller: 'registerLinkAccess',
      error: result.error,
    });

    return badRequest(res);
  }

  const { linkId } = result.data;

  try {
    await s.register({ date: todayDate(), linkId });

    return ok(res);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'registerLinkAccess',
      error,
    });

    return internalServerError(res);
  }
};

export default registerLinkAccess;
