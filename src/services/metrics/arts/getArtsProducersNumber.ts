import { ArtsModel } from '@/models/arts/index.js';
import { ArtsMetricsModel } from '@/models/metrics/arts.js';

const get = async () => {
  const producers = await ArtsMetricsModel.find().distinct('xProfile');
  const arts = await ArtsModel.countDocuments({ approved: true });

  if (!producers || producers.length === 0 || !arts || arts === 0) {
    return null;
  }

  return { producers: producers.length, arts };
};

export { get };
