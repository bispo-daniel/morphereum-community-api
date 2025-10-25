import { type Request, type Response } from 'express';

import { register } from '@/services/arts/registerArt.js';
import { badRequest, ok, internalServerError } from '@/utils/http.js';
import logError from '@/utils/logError.js';
import { publishFlush } from '@/messaging/publish.js';

const registerArt = async (req: Request, res: Response) => {
  try {
    const { creator, xProfile, description } = req.body;
    const imageFile = req.file;

    const imageName = imageFile?.originalname;

    if (!imageFile || !imageFile.buffer || !imageName) {
      logError({
        type: 'bad-request',
        controller: 'registerArt',
        error: 'Missing image file',
      });

      return badRequest(res);
    }

    if (!creator || !xProfile || !description) {
      logError({
        type: 'bad-request',
        controller: 'registerArt',
        error: `Missing required fields: ${{ creator, xProfile, description }}`,
      });

      return badRequest(res);
    }

    await register({ creator, xProfile, description, imageName, imageFile });

    try {
      await publishFlush('arts');
    } catch (e) {
      console.warn('[rabbitmq] --> failed to publish arts.flush', e);
    }

    return ok(res);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'registerArt',
      error,
    });

    return internalServerError(res);
  }
};

export default registerArt;
