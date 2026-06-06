import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description?: string;
  teacherId: string;
  students: any[];
  assignments: any[];
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  teacherId: { type: String, required: true }, // Links to NextAuth user ID
  students: { type: Array, default: [] },
  assignments: { type: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }], default: [] },
}, { timestamps: true });

export const Group = mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);
