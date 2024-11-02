import React from 'react';
import NotificationList from './notifications/NotificationList';

const MobileNotificationsMenu = ({ activeTab }) => {
  if (activeTab !== 'notifications') return null;

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden pt-16 pb-20 overflow-y-auto">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border/40 pb-3">
        <h2 className="px-4 text-lg font-semibold">Notifications</h2>
      </div>
      <NotificationList />
    </div>
  );
};

export default MobileNotificationsMenu;