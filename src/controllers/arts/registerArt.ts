import { type Request, type Response } from 'express';

import { register } from '@/services/arts/registerArt.js';
import { endResponseWithCode, internalServerError } from '@/utils/http.js';
import logError from '@/utils/logError.js';

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

      return endResponseWithCode(res, 400);
    }

    if (!creator || !xProfile || !description) {
      logError({
        type: 'bad-request',
        controller: 'registerArt',
        error: `Missing required fields: ${{ creator, xProfile, description }}`,
      });

      return endResponseWithCode(res, 400);
    }

    await register({ creator, xProfile, description, imageName, imageFile });

    endResponseWithCode(res, 201);
  } catch (error) {
    logError({
      type: 'internal-server-error',
      controller: 'registerArt',
      error,
    });

    internalServerError(res);
  }
};

export default registerArt;
