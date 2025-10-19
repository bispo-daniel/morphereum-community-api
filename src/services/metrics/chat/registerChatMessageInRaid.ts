import { ChatMetricsModel } from '@/models/metrics/chat.js';

const register = async ({ date }: { date: Date }) => {
  const newAccess = new ChatMetricsModel({
    date,
    type: 'raid-message',
  });

  await newAccess.save();
};

export { register };
