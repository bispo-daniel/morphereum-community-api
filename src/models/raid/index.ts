import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

export const RaidSchema = z.object({
  date: z.date(),
  platform: z.string(),
  url: z.string().url(),
  shareMessage: z.string(),
  content: z.string(),
});

export type Raid = z.infer<typeof RaidSchema>;

const raidSchema = new Schema<Raid>({
  date: { type: Date, required: true },
  platform: { type: String, required: true },
  url: { type: String, required: true },
  shareMessage: { type: String, required: true },
  content: { type: String, required: true },
});

export const RaidModel = mongoose.model<Raid>('Raid', raidSchema);
