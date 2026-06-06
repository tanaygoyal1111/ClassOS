import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILessonPlan extends Document {
  userId: mongoose.Types.ObjectId;
  topic: string;
  subject: string;
  grade: string;
  duration: string;
  content: string;
  isArchived?: boolean;
  createdAt: Date;
}

const LessonPlanSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  duration: { type: String, required: true },
  content: { type: String, required: true },
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const LessonPlan: Model<ILessonPlan> = mongoose.models.LessonPlan || mongoose.model<ILessonPlan>("LessonPlan", LessonPlanSchema);
