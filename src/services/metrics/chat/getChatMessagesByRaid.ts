import { ChatMetricsModel } from '@/models/metrics/chat.js';
import { calculateDateRange } from '@/utils/calculateDateRange.js';
import { generateDailyCounts } from '@/utils/generateDailyCounts.js';

const get = async ({ date }: { date: Date }) => {
  const { startDate, endDate } = calculateDateRange(date, 7);

  const records = await ChatMetricsModel.find({
    date: { $gte: startDate, $lte: endDate },
    type: 'raid-message',
  });

  if (!records || records.length === 0) {
    return null;
  }

  const daily = generateDailyCounts(date, 7, records);

  const total = records.length;

  const highestCount: number = daily.reduce(
    (acc, { count }) => (count > acc ? count : acc),
    0
  );

  return { total, highestCount, daily };
};

export { get };
