import { Schema } from 'mongoose';

export const SubscriberSchema = new Schema(
  {
    externalId: { type: String, unique: true },
    name: String,
    provider: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point', required: true },
      coordinates: { type: [Number], required: true },
    },
    notifier: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

SubscriberSchema.index({ location: '2dsphere' });
