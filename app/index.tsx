import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Link, useNavigation } from 'expo-router';
import FirebaseFetcher from '../components/FirebaseFetcher';
import AddStudentModal from '../components/AddStudentModal';
import AddThresholdModal from '../components/AddThresholdModal';
import GradeReviewReminderModal from '../components/GradeReviewReminderModal';
import SettingsModal from '../components/SettingsModal';
import { UserPreferencesContext } from '../UserPreferencesContext';

// Main component to display the index screen with various features
export default function Index() {
  // State for managing visibility of different modals
  const [modalVisible, setModalVisible] = useState(false);
  const [editGradesThresholdModalVisible, setEditGradesThresholdModalVisible] = useState(false);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Access user preferences from context
  const { preferences } = useContext(UserPreferencesContext);

  // Navigation object to handle screen transitions
  const navigation = useNavigation();

  // Function to refresh the student list when a student is added
  const handleStudentAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  // Function to handle scheduling grade review reminders
  const handleScheduleReminder = () => {
    // Check if reminders are enabled in user preferences
    if (preferences.gradeReviewReminders) {
      setReminderModalVisible(true);
    } else {
      // Show alert if reminders are disabled
      Alert.alert(
        'Reminders Disabled',
        'Grade Review Reminders are disabled in your settings. Please enable them to schedule a reminder.',
        [{ text: 'OK' }],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Text */}
      <Text style={styles.headerText}>Student List</Text>

      {/* Container for displaying the list of students */}
      <View style={styles.fixedContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Component to fetch and display students data */}
          <FirebaseFetcher refreshKey={refreshKey} />
        </ScrollView>
      </View>

      {/* Button group for various actions */}
      <ScrollView contentContainerStyle={styles.buttonGroup}>
        {/* Button to open the modal for adding a student */}
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Add Student</Text>
        </TouchableOpacity>

        {/* Button to open the modal for editing grade thresholds */}
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => setEditGradesThresholdModalVisible(true)}
        >
          <Text style={styles.buttonText}>Edit Grade Thresholds</Text>
        </TouchableOpacity>

        {/* Button to schedule a grade review reminder */}
        <TouchableOpacity
          style={[
            styles.button,
            styles.reminderButton,
            !preferences.gradeReviewReminders && styles.buttonDisabled,
          ]}
          onPress={handleScheduleReminder}
          disabled={!preferences.gradeReviewReminders}
        >
          <Text style={styles.buttonText}>Schedule Grade Review Reminder</Text>
        </TouchableOpacity>

        {/* Link to navigate to the Gradebook screen */}
        <Link href="/GradebookScreen" style={[styles.button, styles.gradebookButton]}>
          <Text style={styles.buttonText}>Go to Gradebook</Text>
        </Link>

        {/* Button to open the settings modal */}
        <TouchableOpacity
          style={[styles.button, styles.settingsButton]}
          onPress={() => setSettingsModalVisible(true)}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        {/* Button to navigate to Notification History screen */}
        <TouchableOpacity
          style={[styles.button, styles.historyButton]}
          onPress={() => navigation.navigate('NotificationHistory')}
        >
          <Text style={styles.buttonText}>Notification History</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal components for adding students, editing thresholds, scheduling reminders, and settings */}
      <AddStudentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStudentAdded={handleStudentAdded}
      />

      <AddThresholdModal
        visible={editGradesThresholdModalVisible}
        onClose={() => setEditGradesThresholdModalVisible(false)}
      />

      <GradeReviewReminderModal
        visible={reminderModalVisible}
        onClose={() => setReminderModalVisible(false)}
      />

      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
      />
    </View>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#f0f4f8',
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3a3b3c',
    textAlign: 'center',
    marginBottom: 15,
  },
  fixedContainer: {
    width: '90%',
    height: '55%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#ffccd5',
  },
  scrollContent: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
  },
  buttonGroup: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  button: {
    width: '80%',
    paddingVertical: 12,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#6bcf63',
  },
  editButton: {
    backgroundColor: '#ffab40',
  },
  reminderButton: {
    backgroundColor: '#5da8f9',
  },
  gradebookButton: {
    backgroundColor: '#5da8f9',
  },
  settingsButton: {
    backgroundColor: '#8e44ad',
  },
  historyButton: {
    backgroundColor: '#34495e',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#b0c4de',
  },
});
