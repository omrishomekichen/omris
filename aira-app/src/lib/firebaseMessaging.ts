import { PermissionsAndroid, Platform } from 'react-native';
import {
  getMessaging,
  getToken,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

let defaultMessaging: ReturnType<typeof getMessaging> | null = null;

// Register this while the JavaScript bundle is loading. Registering from a
// component effect is too late for Android's Firebase headless task.
if (Platform.OS === 'android') {
  try {
    defaultMessaging = getMessaging();
    setBackgroundMessageHandler(defaultMessaging, async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  } catch (error) {
    console.error('Unable to register Firebase background handler:', error);
  }
}

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

    const firebaseMessaging = defaultMessaging ?? getMessaging();

    return await getToken(firebaseMessaging);
  } catch (error) {
    console.error('Unable to initialize Firebase Messaging:', error);
    return null;
  }
}
