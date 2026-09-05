import { PermissionsAndroid, Platform } from 'react-native';
import {
  getMessaging,
  getToken,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

/**
 * Configures native Firebase Messaging and returns the current device token.
 * React Native Firebase Messaging is not available in the Expo web runtime.
 */
export async function initializeFirebaseMessaging(): Promise<string | null> {
  if (Platform.OS !== 'android') {
    return null;
  }

  try {
    if (Platform.Version >= 33) {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Notification permission was not granted.');
        return null;
      }
    }

    const firebaseMessaging = getMessaging();

    setBackgroundMessageHandler(firebaseMessaging, async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    return await getToken(firebaseMessaging);
  } catch (error) {
    console.error('Unable to initialize Firebase Messaging:', error);
    return null;
  }
}
