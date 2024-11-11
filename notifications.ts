import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Router } from 'expo-router';

// Set the handler for notifications when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Function to request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  // Check if the device is a physical device
  if (!Constants.isDevice) {
    Alert.alert('Notifications only work on physical devices.');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // If permissions are not already granted, request them
  if (existingStatus !== 'granted') {
    Alert.alert(
      'Permission Required',
      'We need your permission to send you notifications.',
      [{ text: 'OK' }],
    );

    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Handle permission denial
  if (finalStatus !== 'granted') {
    Alert.alert(
      'Permission Denied',
      'You will not receive notifications.',
      [{ text: 'OK' }],
    );
    return false;
  }

  return true;
};

// Function to send immediate notifications
export const sendNotification = async (
  title: string,
  body: string,
  data?: any,
) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: getSound() },
    trigger: null,
  });
};

// Function to schedule notifications for a specific date and time
export const scheduleNotification = async (
  title: string,
  body: string,
  date: Date,
  data?: any,
) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: getSound() },
    trigger: { date },
  });
};

// Helper function to get the correct sound setting based on the platform
const getSound = () => {
  if (Platform.OS === 'android') {
    return 'default'; // For custom sounds on Android, the sound file must be in the app's res/raw directory
  } else {
    return 'default'; // For custom sounds on iOS, the sound file must be included in the app bundle
  }
};

// Set up notification channels for Android (required for custom sounds and importance levels)
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default', // Replace 'default' with your custom sound file name if applicable
  });
}

// Listener for when a notification is received while the app is in the foreground
Notifications.addNotificationReceivedListener((notification) => {
  // You can handle notification data here if needed
  // For example, update your notification history or state
});

// Listener for when a user interacts with a notification (e.g., taps on it)
Notifications.addNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data;

  if (data && data.screen) {
    // Use Router from expo-router to navigate
    Router.push(data.screen);
  }
});

// Optionally, you can remove the listeners when they are no longer needed
export const removeNotificationListeners = () => {
  Notifications.removeAllNotificationListeners();
};
