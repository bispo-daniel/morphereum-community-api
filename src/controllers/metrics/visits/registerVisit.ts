import { type Request, type Response } from 'express';
import { z } from 'zod';

import * as s from '@/services/metrics/visits/registerVisits.js';
import { badRequest, ok, internalServerError } from '@/utils/http.js';
import logError from '@/utils/logError.js';
import { todayDate } from '@/utils/todayDate.js';

const bodySchema = z.object({
  country: z.string().nonempty('Country is required'),
});

const registerVisit = async (req: Request, res: Response) => {
  const result = bodySchema.safeParse(req.body);

  if (!result.success) {
    logError({
      type: 'bad-request',
      controller: 'registerVisit',
      error: result.error,
    });

    return badRequest(res);
  }

  const { country } = result.data;

  try {
    await s.register({ country, date: todayDate() });

    return ok(res);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'registerVisit',
      error,
    });

    return internalServerError(res);
  }
};

export default registerVisit;
