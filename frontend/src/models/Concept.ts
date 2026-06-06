import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConcept extends Document {
  userId: mongoose.Types.ObjectId;
  concept: string;
  subject: string;
  gradeLevel: string;
  content: string;
  isArchived?: boolean;
  createdAt: Date;
}

const ConceptSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  concept: { type: String, required: true },
  subject: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  content: { type: String, required: true },
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Concept: Model<IConcept> = mongoose.models.Concept || mongoose.model<IConcept>("Concept", ConceptSchema);
