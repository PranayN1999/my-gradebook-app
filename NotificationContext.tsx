import React, { createContext, useState, ReactNode, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

interface NotificationContextType {
  notifications: Notifications.Notification[]; // List of notifications
  addNotification: (notification: Notifications.Notification) => void; // Function to add a new notification
}

// Create the Notification Context with an initial value of `undefined`
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Define the props for the NotificationProvider component
interface NotificationProviderProps {
  children: ReactNode; // Children components that the provider will wrap
}

// Create the NotificationProvider component
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  // State to store the list of notifications
  const [notifications, setNotifications] = useState<Notifications.Notification[]>([]);

  // Function to add a new notification to the notifications state
  const addNotification = (notification: Notifications.Notification) => {
    setNotifications((prevNotifications) => [notification, ...prevNotifications]);
  };

  // Set up a listener to handle notifications received while the app is running
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      // Add the received notification to our state
      addNotification(notification);
    });

    // Clean up the listener when the component unmounts to avoid memory leaks
    return () => {
      subscription.remove();
    };
  }, []);

  // Provide the notifications state and addNotification function to the context consumers
  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
