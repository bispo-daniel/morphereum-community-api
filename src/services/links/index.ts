import { LinksModel, LinksSchema } from '@/models/links/index.js';

export const linksData = async () => {
  const links = await LinksModel.find().exec();

  if (!links) return null;

  const parsedLinks = LinksSchema.safeParse(links);

  if (!parsedLinks.success) return null;

  return parsedLinks.data;
};
