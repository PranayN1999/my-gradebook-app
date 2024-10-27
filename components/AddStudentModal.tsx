import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Pressable } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

type AddStudentModalProps = {
  visible: boolean;
  onClose: () => void;
  onStudentAdded: () => void;
};

export default function AddStudentModal({ visible, onClose, onStudentAdded }: AddStudentModalProps) {
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('');

  const handleAddStudent = async () => {
    if (newStudentName && newStudentEmail && newStudentGrade) {
      try {
        await addDoc(collection(db, 'students'), {
          name: newStudentName,
          email: newStudentEmail,
          grade: newStudentGrade
        });
        setNewStudentName('');
        setNewStudentEmail('');
        setNewStudentGrade('');
        onStudentAdded();
        onClose();
      } catch (e) {
        console.error("Error adding student: ", e);
      }
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add New Student</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newStudentName}
            onChangeText={setNewStudentName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={newStudentEmail}
            onChangeText={setNewStudentEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Grade"
            value={newStudentGrade}
            onChangeText={setNewStudentGrade}
          />
          <Button title="Add Student" onPress={handleAddStudent} />
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
