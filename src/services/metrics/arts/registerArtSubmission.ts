import { ArtsMetricsModel } from '@/models/metrics/arts.js';

const register = async ({
  xProfile,
  date,
}: {
  xProfile: string;
  date: Date;
}) => {
  const newAccess = new ArtsMetricsModel({
    xProfile,
    date,
  });

  await newAccess.save();
};

export { register };
