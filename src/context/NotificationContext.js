import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('skillshala_engineering_notifications');
    if (savedNotifications) {
      try {
        const notificationsData = JSON.parse(savedNotifications);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error parsing notifications data:', error);
        localStorage.removeItem('skillshala_engineering_notifications');
      }
    }

    // Set up daily reminders
    setupDailyReminders();
  }, []);

  const saveNotifications = (notificationsData) => {
    setNotifications(notificationsData);
    localStorage.setItem('skillshala_engineering_notifications', JSON.stringify(notificationsData));
  };

  const addNotification = (title, message, type = 'info', actionUrl = null) => {
    const notification = {
      id: Date.now(),
      title,
      message,
      type,
      actionUrl,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedNotifications = [notification, ...notifications];
    saveNotifications(updatedNotifications);
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    saveNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  const showToast = (message, type = 'info', duration = 3000) => {
    const toast = {
      id: Date.now(),
      message,
      type,
      duration
    };

    setToasts(prev => [...prev, toast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, duration);
  };

  const removeToast = (toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  const setupDailyReminders = () => {
    // Check for daily reminders every minute
    const checkReminders = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Morning motivation (9 AM)
      if (hour === 9 && minute === 0) {
        addNotification(
          '🌅 Good Morning, Engineer!',
          'Time to start your coding practice. Your placement success awaits!',
          'reminder',
          '/goals'
        );
      }

      // Afternoon check-in (2 PM)
      if (hour === 14 && minute === 0) {
        addNotification(
          '⚡ Afternoon Boost',
          'How about solving some DSA problems? Keep the momentum going!',
          'reminder',
          '/skill-assessment'
        );
      }

      // Evening review (7 PM)
      if (hour === 19 && minute === 0) {
        addNotification(
          '📊 Daily Review Time',
          'Review your progress and plan for tomorrow. Consistency is key!',
          'reminder',
          '/progress'
        );
      }

      // Weekend project reminder (Saturday 10 AM)
      if (now.getDay() === 6 && hour === 10 && minute === 0) {
        addNotification(
          '🚀 Weekend Project Time',
          'Perfect time to work on your portfolio projects!',
          'reminder',
          '/recommendations'
        );
      }
    };

    // Check immediately and then every minute
    checkReminders();
    setInterval(checkReminders, 60000);
  };

  const addPlacementReminder = (companyName, date, type = 'application') => {
    const reminderDate = new Date(date);
    const now = new Date();
    
    if (reminderDate > now) {
      const timeDiff = reminderDate - now;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      let message = '';
      let title = '';
      
      if (type === 'application') {
        title = `📝 Application Deadline Approaching`;
        message = `${companyName} application deadline is in ${daysDiff} days. Don't miss out!`;
      } else if (type === 'interview') {
        title = `🎯 Interview Scheduled`;
        message = `Your ${companyName} interview is in ${daysDiff} days. Time to prepare!`;
      } else if (type === 'assessment') {
        title = `💻 Coding Assessment`;
        message = `${companyName} coding assessment is in ${daysDiff} days. Practice your DSA!`;
      }
      
      addNotification(title, message, 'placement', '/placement-prep');
    }
  };

  const value = {
    notifications,
    toasts,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount,
    showToast,
    removeToast,
    addPlacementReminder
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
