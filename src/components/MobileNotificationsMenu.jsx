import React from 'react';
import NotificationList from './notifications/NotificationList';

const MobileNotificationsMenu = ({ activeTab }) => {
  if (activeTab !== 'notifications') return null;

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden pt-14 pb-20">
      <div className="h-[calc(100vh-8.5rem)] overflow-y-auto">
        <NotificationList />
      </div>
    </div>
  );
};

export default MobileNotificationsMenu;