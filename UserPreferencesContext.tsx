import React, { createContext, useState, ReactNode } from 'react';

// Define the structure for user preferences
interface Preferences {
  gradeUpdates: boolean;
  thresholdAlerts: boolean;
  classAverageChanges: boolean;
  gradeReviewReminders: boolean;
}

// Define the structure for the context that will be provided
interface UserPreferencesContextType {
  preferences: Preferences;
  setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
}

// Create the context with an initial undefined value
export const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(
  undefined
);

interface UserPreferencesProviderProps {
  children: ReactNode;
}

// Component that provides the context to its children
export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  // State to manage the user's notification preferences with default settings
  const [preferences, setPreferences] = useState<Preferences>({
    gradeUpdates: true,
    thresholdAlerts: true,
    classAverageChanges: true,
    gradeReviewReminders: true,
  });

  return (
    // Provide the current preferences and a function to update them
    <UserPreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
