import { useState } from 'react';
import { Stack } from "expo-router";
import { GradebookContext } from './../GradebookContext';

export default function RootLayout() {
  const [thresholds, setThresholds] = useState({
    "A+": 98,
    "A": 97.5,
    "B+": 91,
    "B": 85,
    "C+": 81,
    "C": 75,
  });

  const calculateGrade = (marks: number) => {
    if (marks >= thresholds["A+"]) return "A+";
    if (marks >= thresholds["A"]) return "A";
    if (marks >= thresholds["B+"]) return "B+";
    if (marks >= thresholds["B"]) return "B";
    if (marks >= thresholds["C+"]) return "C+";
    if (marks >= thresholds["C"]) return "C";
    return "F";
  };

  return (
    <GradebookContext.Provider value={{ thresholds, setThresholds, calculateGrade }}>
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
    </GradebookContext.Provider>
  );
}
