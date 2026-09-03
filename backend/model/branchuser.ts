import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBranchUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
  verified?: boolean;
  role?: "admin" | "StoreOwner";
  branch?: string; 
}

const userSchema: Schema<IBranchUser> = new Schema<IBranchUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  agreeToTerms: { type: Boolean, required: true },
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ["admin", "StoreOwner"], default: "StoreOwner" },
  branch: { type: String }
});

export const BranchUser: Model<IBranchUser> = mongoose.models.BranchUser || mongoose.model<IBranchUser>("BranchUser", userSchema);