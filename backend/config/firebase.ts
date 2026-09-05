import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

/**
 * Initializes the Firebase Admin SDK from a service account JSON.
 *
 * Set FIREBASE_SERVICE_ACCOUNT in your .env to the *entire* JSON content
 * of the service account key file (as a single-line string), downloaded
 * from Firebase Console > Project Settings > Service Accounts >
 * Generate new private key.
 */
if (!getApps().length) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT must be set (paste the Firebase service account JSON) before starting the backend.",
    );
  }

  const serviceAccount = JSON.parse(raw);

  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const messaging = getMessaging();
