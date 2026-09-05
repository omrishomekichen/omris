import mongoose, { Model, Schema } from "mongoose";

export interface IDeviceToken {
  token: string;
  platform: "android";
  lastSeenAt: Date;
}

const deviceTokenSchema = new Schema<IDeviceToken>(
  {
    token: { type: String, required: true, unique: true, trim: true },
    platform: { type: String, enum: ["android"], default: "android" },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const DeviceToken: Model<IDeviceToken> =
  mongoose.models.DeviceToken ||
  mongoose.model<IDeviceToken>("DeviceToken", deviceTokenSchema);
