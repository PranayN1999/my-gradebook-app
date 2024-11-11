import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { GradebookContext } from './../GradebookContext';
import { UserPreferencesContext } from '../UserPreferencesContext';
import { FontAwesome } from '@expo/vector-icons';
import { sendNotification } from './../notifications';
import { useRouter } from 'expo-router';

export default function FirebaseFetcher({ refreshKey }) {
  const [students, setStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { thresholds, calculateGrade } = useContext(GradebookContext);
  const { preferences } = useContext(UserPreferencesContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newMarks, setNewMarks] = useState('');
  const [previousClassAverage, setPreviousClassAverage] = useState(0);
  const isFirstFetch = useRef(true);

  const router = useRouter();

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const studentData = [];
      querySnapshot.forEach((doc) => {
        studentData.push({ id: doc.id, ...doc.data() });
      });
      setStudents(studentData);

      if (isFirstFetch.current && studentData.length > 0) {
        const initialAverage = calculateClassAverage(
          studentData.map((student) => student.marks)
        );
        setPreviousClassAverage(initialAverage);
        isFirstFetch.current = false;
      }
    } catch (err) {
      setError(err.message || 'Error fetching data');
    }
  };

  const calculateClassAverage = (marks) => {
    if (marks.length === 0) return 0;
    const totalMarks = marks.reduce((acc, mark) => acc + mark, 0);
    return totalMarks / marks.length;
  };

  const handleClassAverageChange = async (oldAverage, newAverage) => {
    const difference = Math.abs(newAverage - oldAverage);
    if (difference >= 5) {
      if (preferences.classAverageChanges) {
        await sendNotification(
          'Class Average Updated',
          `The class average has changed by ${difference.toFixed(1)}%!`
        );
      }
      setPreviousClassAverage(newAverage);
    }
  };

  const updateStudentMarks = async (studentId, newMarks) => {
    try {
      const studentDocRef = doc(db, 'students', studentId);
      const oldStudentData = students.find((student) => student.id === studentId);
      const oldGrade = oldStudentData ? calculateGrade(oldStudentData.marks) : null;

      const oldClassAverage = calculateClassAverage(
        students.map((student) => student.marks)
      );

      await updateDoc(studentDocRef, { marks: parseFloat(newMarks) });

      const updatedStudents = students.map((student) => {
        if (student.id === studentId) {
          return { ...student, marks: parseFloat(newMarks) };
        }
        return student;
      });
      setStudents(updatedStudents);

      const newGrade = calculateGrade(parseFloat(newMarks));

      if (oldGrade && oldGrade !== newGrade) {
        if (preferences.gradeUpdates) {
          await sendNotification(
            'Grade Updated',
            `The grade for ${oldStudentData.name} has been updated to ${newGrade}`,
            {
              screen: `/StudentDetails`,
              params: { studentId: studentId },
            }
          );
        }
      }

      if (preferences.thresholdAlerts) {
        for (const [grade, threshold] of Object.entries(thresholds)) {
          if (
            oldStudentData.marks < threshold &&
            parseFloat(newMarks) >= threshold
          ) {
            await sendNotification(
              'Threshold Crossed! 🎉',
              `${oldStudentData.name} has crossed the ${grade} grade threshold!`,
              {
                screen: `/StudentDetails`,
                params: { studentId: studentId },
              }
            );
            break;
          }
        }
      }

      const newClassAverage = calculateClassAverage(
        updatedStudents.map((student) => student.marks)
      );
      await handleClassAverageChange(oldClassAverage, newClassAverage);

      setModalVisible(false);
    } catch (error) {
      console.error('Error updating student marks:', error);
    }
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setNewMarks(student.marks.toString());
    setModalVisible(true);
  };

  const handleUpdateMarks = async () => {
    if (selectedStudent && newMarks) {
      await updateStudentMarks(selectedStudent.id, newMarks);
      setSelectedStudent(null);
      setNewMarks('');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchData();
    };
    initializeData();
  }, [refreshKey]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (students.length === 0 && !refreshing) {
    return <Text style={styles.loadingText}>No students found or loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {students.map((student) => (
          <TouchableOpacity
            key={student.id}
            style={styles.studentContainer}
            onPress={() => router.push(`/StudentDetails?studentId=${student.id}`)}
          >
            <View>
              <Text style={styles.studentText}>Name: {student.name}</Text>
              <Text style={styles.studentText}>Email: {student.email}</Text>
              <Text style={styles.studentText}>Marks: {student.marks}</Text>
              <Text style={styles.studentText}>Grade: {calculateGrade(student.marks)}</Text>
            </View>

            <TouchableOpacity
              onPress={() => handleEditStudent(student)}
              style={styles.updateButton}
            >
              <FontAwesome name="pencil" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.updateButtonText}>Edit Marks</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedStudent && (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Edit Marks for {selectedStudent.name}
              </Text>
              <TextInput
                style={styles.input}
                value={newMarks}
                onChangeText={setNewMarks}
                keyboardType="numeric"
                placeholder="Enter new marks"
              />
              <TouchableOpacity onPress={handleUpdateMarks} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Update Marks</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    paddingBottom: 20,
  },
  studentContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'column', // Changed to column to accommodate the edit button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  studentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
