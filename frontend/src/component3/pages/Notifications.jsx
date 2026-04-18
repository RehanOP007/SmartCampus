import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import './Notifications.css';

const Notifications = () => {
  const { 
    notifications, 
    loading, 
    error, 
    unreadCount,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    getTimeAgo,
    addTestNotification  // Add this
  } = useNotification();

  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [testMessage, setTestMessage] = useState('');

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    setExpandedId(expandedId === notification.id ? null : notification.id);
  };

  const handleAddTestNotification = () => {
    if (testMessage.trim()) {
      addTestNotification(testMessage);
      setTestMessage('');
    } else {
      addTestNotification("🔔 This is a test notification");
    }
  };

  const getNotificationIcon = (message) => {
    if (message.includes('APPROVED') || message.includes('✅')) return '✅';
    if (message.includes('REJECTED') || message.includes('❌')) return '❌';
    if (message.includes('booking')) return '📅';
    if (message.includes('ticket')) return '🎫';
    if (message.includes('resource')) return '🏢';
    return '🔔';
  };

  const getIconColor = (message) => {
    if (message.includes('APPROVED') || message.includes('✅')) return '#28a745';
    if (message.includes('REJECTED') || message.includes('❌')) return '#dc3545';
    if (message.includes('booking')) return '#0077b6';
    if (message.includes('ticket')) return '#ffc107';
    return '#8686AC';
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        
        <div className="notifications-header">
          <div className="header-left">
            <h1>🔔 Notifications</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} unread</span>
            )}
          </div>
          <div className="header-right">
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={markAllAsRead}>
                ✓ Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Test Notification Input - Only for testing */}
        <div className="test-input-section">
          <input
            type="text"
            className="test-input"
            placeholder="Add test notification..."
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTestNotification()}
          />
          <button className="test-add-btn" onClick={handleAddTestNotification}>
            + Add Test
          </button>
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread
            {unreadCount > 0 && <span className="tab-count">{unreadCount}</span>}
          </button>
          <button 
            className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read
          </button>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {!loading && (
          <div className="notifications-list">
            {filteredNotifications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔕</div>
                <h3>No notifications</h3>
                <p>You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : 'read'} ${expandedId === notification.id ? 'expanded' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon" style={{ backgroundColor: `${getIconColor(notification.message)}20` }}>
                    <span style={{ color: getIconColor(notification.message) }}>
                      {getNotificationIcon(notification.message)}
                    </span>
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-header">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{getTimeAgo(notification.createdAt)}</span>
                    </div>
                    
                    {expandedId === notification.id && (
                      <div className="notification-expanded">
                        <div className="expanded-details">
                          <p>📅 Received: {new Date(notification.createdAt).toLocaleString()}</p>
                          <p>🔖 Status: {notification.read ? 'Read' : 'Unread'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="delete-notif-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;