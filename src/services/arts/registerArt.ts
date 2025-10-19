import fs from 'fs';
import path from 'path';

import type { UploadApiOptions } from 'cloudinary';

import { ArtsModel } from '@/models/arts/index.js';
import { cloudinaryConnection } from '@/utils/connectToCloudinary.js';

type Register = {
  creator: string;
  xProfile: string;
  description: string;
  imageName: string;
  imageFile: Express.Multer.File;
};

const register = async ({
  creator,
  xProfile,
  description,
  imageName,
  imageFile,
}: Register) => {
  const uploadDir = path.resolve('./src/uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filename = `img_${imageName}_${Date.now()}.jpg`;
  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, imageFile.buffer);

  const options: UploadApiOptions = {
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  };

  const result = await cloudinaryConnection.uploader.upload(filePath, options);

  const { secure_url: url, display_name: name } = result;

  const newImage = new ArtsModel({
    name,
    creator,
    xProfile,
    description,
    url,
  });

  await newImage.save();

  fs.unlinkSync(filePath);
};

export { register };
