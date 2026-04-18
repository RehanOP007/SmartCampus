import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const notificationService = {
  // Get all notifications for a user
  getUserNotifications: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/notifications/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all as read
  markAllAsRead: async (userId) => {
    try {
      const notifications = await notificationService.getUserNotifications(userId);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      for (const notification of unreadNotifications) {
        await notificationService.markAsRead(notification.id);
      }
      return true;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  },
};

export default notificationService;