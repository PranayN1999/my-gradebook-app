import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GradebookContext } from './../GradebookContext';

export default function GradebookScreen() {
  const { thresholds } = useContext(GradebookContext);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Current Grade Thresholds</Text>
      {Object.keys(thresholds).map((grade) => (
        <View key={grade} style={styles.thresholdContainer}>
          <Text style={styles.gradeText}>{grade}:</Text>
          <Text style={styles.thresholdValue}>{thresholds[grade]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  thresholdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  gradeText: {
    fontSize: 18,
    color: '#6200EE',
    fontWeight: 'bold',
  },
  thresholdValue: {
    fontSize: 18,
    color: '#333',
  },
});
