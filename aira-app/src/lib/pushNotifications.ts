import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { apiRegisterPushToken } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Requests notification permission, grabs this device's Expo push token,
 * and registers it with the backend so it receives "new order" alerts —
 * this works even when the app is closed or backgrounded.
 */
export async function registerForOrderPushNotifications(
  sessionToken?: string,
): Promise<string | null> {
  try {
    if (Platform.OS === 'web' || !Device.isDevice) {
      // Push tokens require a physical device (or won't resolve on simulators).
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('orders', {
        name: 'Orders',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const existing = await Notifications.getPermissionsAsync();
    let finalStatus = existing.status;

    if (finalStatus !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      finalStatus = requested.status;
    }

    if (finalStatus !== 'granted') {
      return null;
    }

    // Raw FCM/APNs device token — sent straight to Firebase, no Expo
    // push relay involved. Requires google-services.json (Android) /
    // GoogleService-Info.plist (iOS) to be present in a native build.
    const { data: deviceToken } = await Notifications.getDevicePushTokenAsync();

    await apiRegisterPushToken(deviceToken, Platform.OS, sessionToken);

    return deviceToken;
  } catch (error) {
    // Never let push registration break login/app startup.
    console.error('Failed to register push token:', error);
    return null;
  }
}
