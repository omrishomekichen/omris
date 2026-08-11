import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOtp extends Document {
  email: string;
  code: string;
  expiresAt: Date;
}

const otpSchema: Schema<IOtp> = new Schema<IOtp>(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

export const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model<IOtp>("Otp", otpSchema);
