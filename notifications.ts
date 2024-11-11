import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Router } from 'expo-router';

// Set up the handler for notifications when the app is in the foreground
Notifications.setNotificationHandler({
  // Configure how notifications behave when they are received while the app is open
  handleNotification: async () => ({
    shouldShowAlert: true, // Display the notification as an alert
    shouldPlaySound: true, // Play the notification sound
    shouldSetBadge: false, // Do not update the app icon badge
  }),
});

// Function to request permissions for notifications
export const requestNotificationPermissions = async (): Promise<boolean> => {
  // Check if notifications are being requested on a physical device
  if (!Constants.isDevice) {
    Alert.alert('Notifications only work on physical devices.');
    return false;
  }

  // Check the current permission status
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // If permissions are not already granted, prompt the user to allow them
  if (existingStatus !== 'granted') {
    Alert.alert(
      'Permission Required',
      'We need your permission to send you notifications.',
      [{ text: 'OK' }]
    );

    // Request permissions from the user
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // If permission is denied, show an alert and return false
  if (finalStatus !== 'granted') {
    Alert.alert(
      'Permission Denied',
      'You will not receive notifications.',
      [{ text: 'OK' }]
    );
    return false;
  }

  return true; // Permission granted
};

// Function to send an immediate notification
export const sendNotification = async (
  title: string,
  body: string,
  data?: any
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: getSound(), // Set sound based on platform
    },
    trigger: null, // Trigger immediately
  });
};

// Function to schedule a notification for a specific date and time
export const scheduleNotification = async (
  title: string,
  body: string,
  date: Date,
  data?: any
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: getSound(), // Set sound based on platform
    },
    trigger: { date }, // Schedule for the specified date and time
  });
};

// Helper function to determine the correct sound to use based on the platform
const getSound = () => {
  if (Platform.OS === 'android') {
    return 'default'; // Use default sound for Android
  } else {
    return 'default'; // Use default sound for iOS
  }
};

// Set up notification channels for Android to handle sound and priority
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX, // High priority notifications
    sound: 'default', // Use the default notification sound
  });
}

// Listener for notifications received while the app is in the foreground
Notifications.addNotificationReceivedListener((notification) => {
  // This function is triggered when a notification is received while the app is active
  // Optional: Handle notification data, update state, or show custom alerts
});

// Listener for when a user interacts with a notification (e.g., taps it)
Notifications.addNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data;

  // If the notification has a "screen" parameter, navigate to that screen
  if (data && data.screen) {
    Router.push(data.screen);
  }
});

// Function to remove all notification listeners (cleanup)
export const removeNotificationListeners = () => {
  Notifications.removeAllNotificationListeners();
};
