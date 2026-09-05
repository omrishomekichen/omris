import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { DeviceToken } from "../model/deviceToken";

const INVALID_TOKEN_CODES = new Set([
  "messaging/invalid-registration-token",
  "messaging/registration-token-not-registered",
]);

function getFirebaseMessaging() {
  if (!getApps().length) {
    const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!rawServiceAccount) {
      console.warn("[FCM] Skipping push notification: FIREBASE_SERVICE_ACCOUNT_JSON is not configured.");
      return null;
    }

    try {
      initializeApp({ credential: cert(JSON.parse(rawServiceAccount)) });
    } catch (error) {
      console.error("[FCM] Unable to initialize Firebase Admin:", error);
      return null;
    }
  }

  return getMessaging();
}

export async function sendNewOrderPushNotification(order: {
  orderId: string;
  customerName: string;
  totalPrice: number;
}) {
  const messaging = getFirebaseMessaging();
  if (!messaging) return;

  const storedTokens = await DeviceToken.find({}).select("token").lean();
  const tokens = storedTokens.map(({ token }) => token).filter(Boolean);
  if (!tokens.length) return;

  const invalidTokens: string[] = [];
  for (let index = 0; index < tokens.length; index += 500) {
    const batch = tokens.slice(index, index + 500);
    const response = await messaging.sendEachForMulticast({
      tokens: batch,
      notification: {
        title: "New order received",
        body: `${order.orderId} from ${order.customerName} — ₹${order.totalPrice}`,
      },
      data: { type: "new_order", orderId: order.orderId },
      android: { priority: "high" },
    });

    response.responses.forEach((result, resultIndex) => {
      if (!result.success && result.error?.code && INVALID_TOKEN_CODES.has(result.error.code)) {
        invalidTokens.push(batch[resultIndex]);
      }
    });
  }

  if (invalidTokens.length) {
    await DeviceToken.deleteMany({ token: { $in: invalidTokens } });
  }

  console.log(`[FCM] New-order notification sent to ${tokens.length - invalidTokens.length} device(s).`);
}
