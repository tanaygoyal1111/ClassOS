import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  userId: string;
  title: string;
  classLevel: string;
  subject: string;
  groupId?: string;
  institutionName?: string;
  studentFieldsSnapshot?: string[];
  paperContent: any;
  isArchived?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema(
  {
    userId: { type: String, required: true }, // Links to NextAuth user ID
    title: { type: String, required: true },
    classLevel: { type: String, required: true },
    subject: { type: String, required: true },
    groupId: { type: String, required: false }, // Optional link to a group
    institutionName: { type: String, required: false },
    studentFieldsSnapshot: { type: [String], required: false, default: [] },
    paperContent: { type: Schema.Types.Mixed, required: true }, // Stores the entire JSON response
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Assignment = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
