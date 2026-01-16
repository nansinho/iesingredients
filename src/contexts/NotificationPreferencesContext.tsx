import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface NotificationPreferences {
  soundEnabled: boolean;
  toastEnabled: boolean;
  emailEnabled: boolean;
}

interface NotificationPreferencesContextType {
  preferences: NotificationPreferences;
  updatePreference: <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => void;
}

const defaultPreferences: NotificationPreferences = {
  soundEnabled: true,
  toastEnabled: true,
  emailEnabled: false,
};

const STORAGE_KEY = "admin-notification-preferences";

const NotificationPreferencesContext = createContext<NotificationPreferencesContextType | undefined>(undefined);

export function NotificationPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return { ...defaultPreferences, ...JSON.parse(stored) };
        } catch {
          return defaultPreferences;
        }
      }
    }
    return defaultPreferences;
  });

  // Persist to localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <NotificationPreferencesContext.Provider value={{ preferences, updatePreference }}>
      {children}
    </NotificationPreferencesContext.Provider>
  );
}

export function useNotificationPreferences() {
  const context = useContext(NotificationPreferencesContext);
  if (!context) {
    throw new Error("useNotificationPreferences must be used within a NotificationPreferencesProvider");
  }
  return context;
}
