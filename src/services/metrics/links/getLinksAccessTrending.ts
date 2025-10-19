import { LinksModel } from '@/models/links/index.js';
import { LinksMetricsModel } from '@/models/metrics/links.js';

const get = async () => {
  const metrics = await LinksMetricsModel.aggregate([
    {
      $group: {
        _id: '$linkId',
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

  const linksIds = metrics.map((metric) => metric._id);

  const LinksDetails = await LinksModel.find(
    { _id: { $in: linksIds } },
    { _id: 1, label: 1, icon: 1 }
  );

  if (!LinksDetails || LinksDetails.length === 0) return null;

  const links = metrics
    .map((metric) => {
      const linkDetail = LinksDetails.find((link) =>
        link._id.equals(metric._id)
      );

      if (!linkDetail) return null;

      return {
        count: metric.totalCount,
        label: linkDetail.label,
        icon: linkDetail.icon,
      };
    })
    .filter((link): link is NonNullable<typeof link> => link !== null);

  if (!links || links.length === 0) return null;

  const total = links.reduce((sum, link) => sum + link.count, 0);

  return { total, links };
};

export { get };
