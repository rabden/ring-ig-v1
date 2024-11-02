import React from 'react';
import NotificationList from './notifications/NotificationList';

const MobileNotificationsMenu = ({ activeTab }) => {
  if (activeTab !== 'notifications') return null;

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden pt-16 pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-border/40">
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold tracking-tight">Notifications</h2>
        </div>
      </div>
      <div className="h-[calc(100vh-9rem)] overflow-y-auto">
        <NotificationList />
      </div>
    </div>
  );
};

export default MobileNotificationsMenu;