import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import FirebaseFetcher from '../components/FirebaseFetcher';
import AddStudentModal from '../components/AddStudentModal';
import AddThresholdModal from '../components/AddThresholdModal';

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editGradesThresholdModalVisible, setEditGradesThresholdModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStudentAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Student List</Text>
      
      <View style={styles.fixedContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <FirebaseFetcher refreshKey={refreshKey} />
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.buttonGroup}>
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Add User</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setEditGradesThresholdModalVisible(true)}>
          <Text style={styles.buttonText}>Edit Grade Thresholds</Text>
        </TouchableOpacity>
        
        <Link href="/GradebookScreen" style={[styles.button, styles.gradebookButton]}>
          <Text style={styles.buttonText}>Go to Gradebook</Text>
        </Link>
      </ScrollView>

      <AddStudentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStudentAdded={handleStudentAdded}
      />

      <AddThresholdModal
        visible={editGradesThresholdModalVisible}
        onClose={() => setEditGradesThresholdModalVisible(false)}
      />
    </View>
  );
}

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
    justifyContent: 'center',  // Center text vertically within the button
  },
  addButton: {
    backgroundColor: '#6bcf63',
  },
  editButton: {
    backgroundColor: '#ffab40',
  },
  gradebookButton: {
    backgroundColor: '#5da8f9',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Ensures the text is centered within the link
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',  // Center text horizontally within the Text component
  },
});

