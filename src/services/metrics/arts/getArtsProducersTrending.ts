import { ArtsModel } from '@/models/arts/index.js';

const get = async () => {
  const artsAggregation = await ArtsModel.aggregate([
    {
      $group: {
        _id: '$xProfile',
        creator: { $first: '$creator' },
        count: { $sum: 1 },
        approvedCount: {
          $sum: {
            $cond: [{ $eq: ['$approved', true] }, 1, 0],
          },
        },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const total = artsAggregation.reduce(
    (sum, producer) => sum + producer.count,
    0
  );

  const producers = artsAggregation.map(
    ({ _id, creator, count, approvedCount }) => ({
      xProfile: _id,
      creator,
      count,
      approvedCount,
    })
  );

  return {
    total,
    producers,
  };
};

export { get };
