import { ArtsMetricsModel } from '@/models/metrics/arts.js';
import { calculateDateRange } from '@/utils/calculateDateRange.js';
import { generateDailyCounts } from '@/utils/generateDailyCounts.js';

interface MetricsResponse {
  total: number;
  highestCount: number;
  daily: { date: string; count: number }[];
}

interface GetParams {
  date: Date;
}

const get = async ({ date }: GetParams): Promise<MetricsResponse | null> => {
  const { startDate, endDate } = calculateDateRange(date, 7);

  const records = await ArtsMetricsModel.find({
    date: { $gte: startDate, $lte: endDate },
  });

  if (!records || records.length === 0) return null;

  const total = records.length;
  const daily = generateDailyCounts(date, 7, records);

  const highestCount = daily.reduce(
    (acc, { count }) => (count > acc ? count : acc),
    0
  );

  return { total, highestCount, daily };
};

export { get };
