import bcrypt from "bcryptjs";
import mongoose, { Document, Model, Schema } from "mongoose";


export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
  verified?: boolean;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  agreeToTerms: { type: Boolean, required: true },
  verified: { type: Boolean, default: false },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);