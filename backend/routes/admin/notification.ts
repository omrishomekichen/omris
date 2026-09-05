import express, { Request, Response } from "express";
import { DeviceToken } from "../../model/deviceToken";


const adminnotificationRouter: express.Router = express.Router();


adminnotificationRouter.post("/push-notification-token", async (req: Request, res: Response) => {
  const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";

  if (!token) {
    return res.status(400).json({ success: false, message: "Firebase token is required" });
  }

  try {
    await DeviceToken.findOneAndUpdate(
      { token },
      { $set: { platform: "android", lastSeenAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log(`[FCM] Device token stored: ${token}`);
    return res.sendStatus(204);
  } catch (error) {
    console.error("Failed to store Firebase device token:", error);
    return res.status(500).json({ success: false, message: "Failed to store Firebase token" });
  }
});

export default adminnotificationRouter;
