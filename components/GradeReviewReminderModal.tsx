import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleNotification } from '../notifications';

interface GradeReviewReminderModalProps {
  visible: boolean;
  onClose: () => void;
}

const GradeReviewReminderModal: React.FC<GradeReviewReminderModalProps> = ({ visible, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      const currentTime = selectedDate || new Date();
      currentTime.setHours(time.getHours());
      currentTime.setMinutes(time.getMinutes());
      setSelectedTime(currentTime);
    }
  };

  const handleScheduleReminder = async () => {
    if (selectedDate && selectedTime) {
      const notificationDate = new Date(selectedDate);
      notificationDate.setHours(selectedTime.getHours());
      notificationDate.setMinutes(selectedTime.getMinutes());

      await scheduleNotification(
        'Grade Review Reminder',
        'Your grade review is due tomorrow!',
        notificationDate
      );

      alert('Reminder scheduled successfully!');
      onClose();
    } else {
      alert('Please select both date and time.');
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Schedule Grade Review Reminder</Text>

          {/* Date Input Field */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputField}>
            <Text style={styles.inputText}>
              {selectedDate ? selectedDate.toDateString() : 'Select Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="calendar"
              onChange={handleDateChange}
            />
          )}

          {/* Time Input Field */}
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.inputField}>
            <Text style={styles.inputText}>
              {selectedTime
                ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Select Time'}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime || new Date()}
              mode="time"
              display="clock"
              onChange={handleTimeChange}
            />
          )}

          {/* Schedule Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleScheduleReminder}>
            <Text style={styles.saveButtonText}>Schedule Reminder</Text>
          </TouchableOpacity>
          
          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputField: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default GradeReviewReminderModal;
