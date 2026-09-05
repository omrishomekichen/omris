import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPushToken extends Document {
  branchUserId: mongoose.Types.ObjectId;
  token: string;
  platform?: "ios" | "android" | "web";
  createdAt: Date;
  updatedAt: Date;
}

const pushTokenSchema: Schema<IPushToken> = new Schema<IPushToken>(
  {
    branchUserId: {
      type: Schema.Types.ObjectId,
      ref: "BranchUser",
      required: true,
      index: true,
    },
    token: { type: String, required: true, unique: true },
    platform: { type: String, enum: ["ios", "android", "web"] },
  },
  { timestamps: true },
);

export const PushToken: Model<IPushToken> =
  mongoose.models.PushToken ||
  mongoose.model<IPushToken>("PushToken", pushTokenSchema);
