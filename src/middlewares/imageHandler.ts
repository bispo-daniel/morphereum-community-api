import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';

import { badRequest, internalServerError } from '@/utils/http.js';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed!'));
    }

    cb(null, true);
  },
}).single('image');

const imageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, async function (err) {
    if (err) return badRequest(res);

    if (!req.file) return badRequest(res);

    try {
      const compressedImage = await sharp(req.file.buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

      req.file.buffer = compressedImage;
      next();
    } catch (_error) {
      return internalServerError(res);
    }
  });
};

export { imageHandler };
