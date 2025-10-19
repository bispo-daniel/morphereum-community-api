import { RaidMetricsModel } from '@/models/metrics/raid.js';
import { RaidModel } from '@/models/raid/index.js';
import { format } from 'date-fns';

const get = async () => {
  const metrics = await RaidMetricsModel.aggregate([
    {
      $group: {
        _id: '$date',
        totalCount: { $sum: +1 },
      },
    },
    {
      $sort: { totalCount: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  if (!metrics || metrics.length === 0) return null;

  const dailyDates = metrics.map((metric) => metric._id);

  const raidDetails = await RaidModel.find(
    { date: { $in: dailyDates } },
    { _id: 0, date: 1, platform: 1 }
  );

  if (!raidDetails || raidDetails.length === 0) return null;

  const raids = metrics
    .map((metric) => {
      const raidDetail = raidDetails.find(
        (raid) => raid.date.toISOString() === metric._id.toISOString()
      );

      if (!raidDetail) return null;

      return {
        date: format(metric._id, 'dd/MM/yyyy'),
        count: metric.totalCount,
        platform: raidDetail.platform,
      };
    })
    .filter((raid): raid is NonNullable<typeof raid> => raid !== null);

  if (!raids || raids.length === 0) return null;

  const total = raids.reduce((sum, raid) => sum + raid.count, 0);

  return { total, raids };
};

export { get };
