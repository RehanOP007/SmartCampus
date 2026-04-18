import React from 'react';
import { NotificationProvider } from './context/NotificationContext';
import Notifications from './pages/Notifications';

const TestNotifications = () => {
  return (
    <NotificationProvider>
      <Notifications />
    </NotificationProvider>
  );
};

export default TestNotifications;