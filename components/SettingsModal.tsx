import React, { useContext } from 'react';
import { View, Text, Switch, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { UserPreferencesContext } from './../UserPreferencesContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<Props> = ({ visible, onClose }) => {
  const preferencesContext = useContext(UserPreferencesContext);

  if (!preferencesContext) {
    return null;
  }

  const { preferences, setPreferences } = preferencesContext;

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [key]: !prevPreferences[key],
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Notification Settings</Text>

          {Object.keys(preferences).map((key) => (
            <View key={key} style={styles.preferenceRow}>
              <Text style={styles.preferenceText}>{formatPreferenceKey(key)}</Text>
              <Switch
                value={preferences[key as keyof typeof preferences]}
                onValueChange={() => togglePreference(key as keyof typeof preferences)}
              />
            </View>
          ))}

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SettingsModal;

// Helper function to format preference keys for display
const formatPreferenceKey = (key: string) => {
  switch (key) {
    case 'gradeUpdates':
      return 'Grade Updates';
    case 'thresholdAlerts':
      return 'Threshold Alerts';
    case 'classAverageChanges':
      return 'Class Average Changes';
    case 'gradeReviewReminders':
      return 'Grade Review Reminders';
    default:
      return key;
  }
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  preferenceText: {
    fontSize: 18,
    color: '#333',
  },
  closeButton: {
    marginTop: 30,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
