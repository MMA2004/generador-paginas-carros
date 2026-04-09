import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  clerkUserId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
