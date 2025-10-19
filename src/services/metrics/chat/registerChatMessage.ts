import { ChatMetricsModel } from '@/models/metrics/chat.js';

const register = async ({ date }: { date: Date }) => {
  const newAccess = new ChatMetricsModel({
    date,
    type: 'user-message',
  });

  await newAccess.save();
};

export { register };
