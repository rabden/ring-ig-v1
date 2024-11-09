import React from 'react';
import NotificationList from './notifications/NotificationList';
import { ScrollArea } from "@/components/ui/scroll-area";

const MobileNotificationsMenu = ({ activeTab }) => {
  if (activeTab !== 'notifications') return null;

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden">
      <div className="flex flex-col h-full">
        <div className="border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <ScrollArea className="flex-1 px-2">
          <div className="py-2 pb-[calc(4rem+env(safe-area-inset-bottom))]">
            <NotificationList />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MobileNotificationsMenu;