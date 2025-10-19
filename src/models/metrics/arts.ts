import { Schema, model } from 'mongoose';

const ArtsMetricsSchema = new Schema(
  {
    xProfile: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { collection: 'arts_metrics' }
);

export const ArtsMetricsModel = model('artsMetricsModel', ArtsMetricsSchema);
