import mongoose, { Schema, model, models } from 'mongoose';

const CreditLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true, // "Resume Generation", "AI Rewrite", "ATS Optimization", "Cover Letter Generation", "Sign-up Bonus"
  },
  amount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

export const CreditLog = models.CreditLog || model('CreditLog', CreditLogSchema);
