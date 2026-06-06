import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description?: string;
  teacherId: string;
  students: any[];
  assignments: any[];
  createdAt: Date;
}

const GroupSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  teacherId: { type: String, required: true }, // Using String to store the NextAuth ID
  students: { type: Array, default: [] },
  assignments: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const Group = mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);
