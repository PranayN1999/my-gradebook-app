import React, { createContext, useState, ReactNode, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

interface NotificationContextType {
  notifications: Notifications.Notification[];
  addNotification: (notification: Notifications.Notification) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notifications.Notification[]>([]);

  // Function to add a notification to the state
  const addNotification = (notification: Notifications.Notification) => {
    setNotifications((prevNotifications) => [notification, ...prevNotifications]);
  };

  // Set up the notification received listener
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      addNotification(notification);
    });

    // Clean up the listener when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
