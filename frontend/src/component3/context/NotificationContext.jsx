import React, { createContext, useState, useContext, useEffect } from 'react';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

// Mock Notifications for Testing
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    message: "✅ Your booking for Computer Laboratory A has been APPROVED",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 2,
    message: "🎫 Your maintenance ticket #T-1001 has been updated to IN_PROGRESS",
    read: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
  },
  {
    id: 3,
    message: "❌ Your booking for Lecture Hall 101 has been REJECTED",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: 4,
    message: "🏢 New resource has been added: Physics Laboratory",
    read: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: 5,
    message: "📅 Your booking request is pending approval",
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
  },
  {
    id: 6,
    message: "🔧 Your ticket #T-1002 has been RESOLVED",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 mins ago
  },
  {
    id: 7,
    message: "✅ Resource Smart Board has been added to inventory",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async (userId) => {
    setLoading(true);
    try {
      // Use mock data for testing
      setNotifications(MOCK_NOTIFICATIONS);
      const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length;
      setUnreadCount(unread);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const updatedNotifications = notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      setNotifications(updatedNotifications);
      const unread = updatedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      return true;
    } catch (err) {
      setError('Failed to mark as read');
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      return true;
    } catch (err) {
      setError('Failed to mark all as read');
      throw err;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setNotifications(updatedNotifications);
      const unread = updatedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      return true;
    } catch (err) {
      setError('Failed to delete notification');
      throw err;
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Add a new notification (for testing/demo)
  const addTestNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message: message,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchNotifications(userId);
    } else {
      // If no userId, still load mock data for testing
      fetchNotifications(null);
    }
  }, []);

  const value = {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getTimeAgo,
    addTestNotification  // For testing purposes
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};