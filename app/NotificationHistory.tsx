import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NotificationContext } from '../NotificationContext';

// This component displays a history of notifications
export default function NotificationHistory() {
  // Access the NotificationContext to get the list of notifications
  const context = useContext(NotificationContext);

  // If context is not available, return nothing (this handles edge cases)
  if (!context) {
    return null;
  }

  const { notifications } = context; // Destructure notifications from the context

  return (
    <View style={styles.container}>
      {/* Title for the screen */}
      <Text style={styles.title}>Notification History</Text>

      {/* Check if there are any notifications */}
      {notifications.length === 0 ? (
        // Display a message if no notifications are available
        <Text style={styles.noNotifications}>No notifications to display.</Text>
      ) : (
        // If notifications exist, render them using FlatList
        <FlatList
          data={notifications} // Pass the notifications array as the data source
          keyExtractor={(item) => item.request.identifier} // Use the unique notification ID as the key
          renderItem={({ item }) => (
            // Render each notification in a styled container
            <View style={styles.notificationItem}>
              {/* Display the notification title */}
              <Text style={styles.notificationTitle}>
                {item.request.content.title}
              </Text>
              {/* Display the notification body */}
              <Text>{item.request.content.body}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20
  },
  notificationItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  notificationTitle: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    marginBottom: 5
  },
  noNotifications: { 
    fontSize: 16, 
    color: '#777', 
    textAlign: 'center', 
    marginTop: 50
  },
});
