import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRubric extends Document {
  userId: mongoose.Types.ObjectId;
  assignmentTitle: string;
  subject: string;
  gradeLevel: string;
  maxMarks: string;
  content: string;
  isArchived?: boolean;
  createdAt: Date;
}

const RubricSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignmentTitle: { type: String, required: true },
  subject: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  maxMarks: { type: String, required: true },
  content: { type: String, required: true },
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Rubric: Model<IRubric> = mongoose.models.Rubric || mongoose.model<IRubric>("Rubric", RubricSchema);
