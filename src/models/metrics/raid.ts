import { Schema, model } from 'mongoose';

const raidMetricsSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { collection: 'raid_metrics' }
);

export const RaidMetricsModel = model('RaidMetricsModel', raidMetricsSchema);
