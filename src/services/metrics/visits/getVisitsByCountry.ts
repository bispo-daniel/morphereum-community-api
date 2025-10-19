import { VisitsMetricsModel } from '@/models/metrics/visits.js';

const get = async () => {
  const countries = await VisitsMetricsModel.aggregate([
    {
      $group: {
        _id: '$country',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        country: '$_id',
        count: 1,
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  if (!countries || countries.length === 0) {
    return null;
  }

  const highestCount: number = countries.reduce(
    (acc, { count }) => (count > acc ? count : acc),
    0
  );

  return { highestCount, countries };
};

export { get };
