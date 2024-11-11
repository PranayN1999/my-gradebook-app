import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { GradebookContext } from '../GradebookContext';

export default function StudentDetails() {
  const { studentId } = useLocalSearchParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { calculateGrade } = useContext(GradebookContext);

  const fetchStudentDetails = async (id) => {
    try {
      const studentDocRef = doc(db, 'students', id);
      const studentDoc = await getDoc(studentDocRef);
      if (studentDoc.exists()) {
        setStudent({ id: studentDoc.id, ...studentDoc.data() });
      } else {
        console.log('No such student!');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails(studentId);
    } else {
      setLoading(false);
    }
  }, [studentId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading Student Details...</Text>
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Student not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{student.name}</Text>
      <Text style={styles.detailText}>Email: {student.email}</Text>
      <Text style={styles.detailText}>Marks: {student.marks}</Text>
      <Text style={styles.detailText}>Grade: {calculateGrade(student.marks)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3a3b3c',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    color: '#3a3b3c',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 20,
    color: 'red',
  },
});
