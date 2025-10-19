import { RaidModel, RaidSchema } from '@/models/raid/index.js';
import { todayDate } from '@/utils/todayDate.js';

export const raidData = async () => {
  const raid = await RaidModel.findOne({
    date: { $eq: todayDate() },
  }).exec();

  if (!raid) return null;

  const parsedRaid = RaidSchema.safeParse(raid.toObject());

  if (!parsedRaid.success) return null;

  return parsedRaid.data;
};
