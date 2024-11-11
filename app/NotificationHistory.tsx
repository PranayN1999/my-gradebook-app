import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NotificationContext } from '../NotificationContext';

export default function NotificationHistory() {
  const context = useContext(NotificationContext);

  if (!context) {
    return null;
  }

  const { notifications } = context;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification History</Text>
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No notifications to display.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.request.identifier}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <Text style={styles.notificationTitle}>
                {item.request.content.title}
              </Text>
              <Text>{item.request.content.body}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  notificationItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  notificationTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  noNotifications: { fontSize: 16, color: '#777', textAlign: 'center', marginTop: 50 },
});
