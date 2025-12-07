import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface NotificationSettings {
  enabled: boolean;
  reminderTime: string; // HH:mm format
  dailyReminder: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  reminderTime: '09:00',
  dailyReminder: true,
};

export const useNotifications = () => {
  const [settings, setSettings] = useLocalStorage<NotificationSettings>('notification-settings', DEFAULT_SETTINGS);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      setSettings({ ...settings, enabled: true });
      return true;
    }
    return false;
  }, [settings, setSettings]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted' && settings.enabled) {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
    return null;
  }, [permission, settings.enabled]);

  const sendHabitReminder = useCallback((habitName: string) => {
    return sendNotification('Habit Reminder 🎯', {
      body: `Don't forget to complete: ${habitName}`,
      tag: 'habit-reminder',
      requireInteraction: true,
    });
  }, [sendNotification]);

  const sendStreakAlert = useCallback((habitName: string, streak: number) => {
    return sendNotification('Streak at Risk! 🔥', {
      body: `Your ${streak}-day streak for "${habitName}" needs attention!`,
      tag: 'streak-alert',
      requireInteraction: true,
    });
  }, [sendNotification]);

  const sendAchievementUnlocked = useCallback((achievementName: string, emoji: string) => {
    return sendNotification(`Achievement Unlocked! ${emoji}`, {
      body: achievementName,
      tag: 'achievement',
    });
  }, [sendNotification]);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings({ ...settings, ...newSettings });
  }, [settings, setSettings]);

  const toggleEnabled = useCallback(async () => {
    if (!settings.enabled && permission !== 'granted') {
      return await requestPermission();
    }
    setSettings({ ...settings, enabled: !settings.enabled });
    return true;
  }, [settings, permission, requestPermission, setSettings]);

  return {
    settings,
    permission,
    requestPermission,
    sendNotification,
    sendHabitReminder,
    sendStreakAlert,
    sendAchievementUnlocked,
    updateSettings,
    toggleEnabled,
    isSupported: 'Notification' in window,
  };
};
