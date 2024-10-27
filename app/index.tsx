import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import FirebaseFetcher from '../components/FirebaseFetcher';
import AddStudentModal from '../components/AddStudentModal';

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStudentAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <View style={styles.container}>
      <FirebaseFetcher refreshKey={refreshKey} />
      <Button title="Add User" onPress={() => setModalVisible(true)} />

      <AddStudentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStudentAdded={handleStudentAdded}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
