import React, { createContext, useState, ReactNode } from 'react';

interface Preferences {
  gradeUpdates: boolean;
  thresholdAlerts: boolean;
  classAverageChanges: boolean;
  gradeReviewReminders: boolean;
}

interface UserPreferencesContextType {
  preferences: Preferences;
  setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
}

export const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(
  undefined
);

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>({
    gradeUpdates: true,
    thresholdAlerts: true,
    classAverageChanges: true,
    gradeReviewReminders: true,
  });

  return (
    <UserPreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
