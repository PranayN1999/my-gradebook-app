import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { GradebookContext } from './../GradebookContext';
import { UserPreferencesProvider } from '../UserPreferencesContext';
import { NotificationProvider } from '../NotificationContext';
import { requestNotificationPermissions } from '../notifications';

export default function RootLayout() {
  const [thresholds, setThresholds] = useState({
    "A+": 98,
    "A": 92.5,
    "B+": 89.9,
    "B": 85,
    "C+": 81,
    "C": 75,
  });

  const calculateGrade = (marks: number) => {
    if (marks >= thresholds["A+"]) return "A+";
    if (marks >= thresholds["A"]) return "A";
    if (marks >= thresholds["B+"]) return "B+";
    if (marks >= thresholds["B"]) return "B";
    if (marks >= thresholds["C+"]) return "C+";
    if (marks >= thresholds["C"]) return "C";
    return "F";
  };

  // Request notification permissions on app startup
  useEffect(() => {
    const getPermissions = async () => {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        // Handle the case when permissions are not granted
        console.log("Notification permission not given")
      }
    };
    getPermissions();
  }, []);

  return (
    <GradebookContext.Provider value={{ thresholds, setThresholds, calculateGrade }}>
      <UserPreferencesProvider>
        <NotificationProvider>
          <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="GradebookScreen" />
            <Stack.Screen name="NotificationHistory" />
          </Stack>
        </NotificationProvider>
      </UserPreferencesProvider>
    </GradebookContext.Provider>
  );
}
