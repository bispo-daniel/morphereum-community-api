import { Schema, model } from 'mongoose';

const visitsMetricsSchema = new Schema(
  {
    country: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { collection: 'visits_metrics' }
);

export const VisitsMetricsModel = model(
  'VisitsMetricsModel',
  visitsMetricsSchema
);
