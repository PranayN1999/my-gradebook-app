import React, { useContext, useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { GradebookContext } from './../GradebookContext';

export default function AddThresholdModal({ visible, onClose }) {
  const { thresholds, setThresholds } = useContext(GradebookContext);
  const [localThresholds, setLocalThresholds] = useState({
    "A+": thresholds["A+"],
    "A": thresholds["A"],
    "B+": thresholds["B+"],
    "B": thresholds["B"],
    "C+": thresholds["C+"],
    "C": thresholds["C"],
  });

  const handleInputChange = (grade, value) => {
    setLocalThresholds((prevThresholds) => ({
      ...prevThresholds,
      [grade]: value,
    }));
  };

  const handleSubmit = () => {
    const parsedThresholds = {
      "A+": Number(localThresholds["A+"]),
      "A": Number(localThresholds["A"]),
      "B+": Number(localThresholds["B+"]),
      "B": Number(localThresholds["B"]),
      "C+": Number(localThresholds["C+"]),
      "C": Number(localThresholds["C"]),
    };
    setThresholds(parsedThresholds);
    onClose(); // Close modal after submitting
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Edit Grade Thresholds</Text>
          
          {Object.keys(localThresholds).map((grade) => (
            <View key={grade} style={styles.inputContainer}>
              <Text style={styles.label}>{grade} Threshold:</Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${grade} threshold`}
                value={String(localThresholds[grade])}
                onChangeText={(text) => handleInputChange(grade, text)}
                keyboardType="numeric"
              />
            </View>
          ))}

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#6200EE',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#888',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
