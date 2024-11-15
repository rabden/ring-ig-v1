import React from 'react';
import NotificationList from './notifications/NotificationList';

const MobileNotificationsMenu = ({ activeTab }) => {
  if (activeTab !== 'notifications') return null;

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden overflow-hidden">
      <NotificationList />
    </div>
  );
};

export default MobileNotificationsMenu;