import { messaging } from "../config/firebase";
import { PushToken } from "../model/pushToken.js";

/**
 * Sends a push notification to every registered admin device via FCM.
 * Fire-and-forget from the caller's perspective: this never throws,
 * it just logs on failure so a notification issue never blocks an order.
 */
export async function sendPushToAdmins(
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<void> {
  try {
    const tokens = await PushToken.find({}).lean();

    if (!tokens.length) return;

    const tokenStrings = tokens.map((t) => t.token);

    // FCM accepts up to 500 tokens per multicast call.
    const chunkSize = 500;
    for (let i = 0; i < tokenStrings.length; i += chunkSize) {
      const chunk = tokenStrings.slice(i, i + chunkSize);

      const response = await messaging.sendEachForMulticast({
        tokens: chunk,
        notification: { title, body },
        data: data || {},
        android: {
          priority: "high",
          notification: { channelId: "orders", sound: "default" },
        },
        apns: {
          payload: { aps: { sound: "default" } },
        },
      });

      const invalidTokens: string[] = [];
      response.responses.forEach((result, idx) => {
        if (!result.success) {
          const code = result.error?.code;
          if (
            code === "messaging/registration-token-not-registered" ||
            code === "messaging/invalid-registration-token"
          ) {
            invalidTokens.push(chunk[idx]);
          } else {
            console.error("FCM send error:", code, result.error?.message);
          }
        }
      });

      if (invalidTokens.length) {
        await PushToken.deleteMany({ token: { $in: invalidTokens } }).catch(
          () => {},
        );
      }
    }
  } catch (error) {
    console.error("Failed to send admin push notification:", error);
  }
}
