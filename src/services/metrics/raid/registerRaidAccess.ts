import { RaidMetricsModel } from '@/models/metrics/raid.js';

const register = async ({ date }: { date: Date }) => {
  const newAccess = new RaidMetricsModel({
    date,
  });

  await newAccess.save();
};

export { register };
