import React, { useState } from 'react';
import { BarChart3, Users, Image, Settings, LogOut } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import AnalyticsOverview from './AnalyticsOverview';
import UsersSection from './UsersSection';
import ImagesSection from './ImagesSection';

const AdminLayout = () => {
  const [activeSection, setActiveSection] = useState('analytics');

  const renderSection = () => {
    switch (activeSection) {
      case 'analytics':
        return <AnalyticsOverview />;
      case 'users':
        return <UsersSection />;
      case 'images':
        return <ImagesSection />;
      default:
        return <AnalyticsOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b h-16 flex items-center px-6 justify-between bg-card">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button className="text-muted-foreground hover:text-foreground">
            <Settings className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 border-r h-[calc(100vh-4rem)] p-4 bg-card">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('analytics')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left ${
                activeSection === 'analytics' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left ${
                activeSection === 'users' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </button>
            <button
              onClick={() => setActiveSection('images')}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left ${
                activeSection === 'images' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              <Image className="h-5 w-5" />
              <span>Images</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <ScrollArea className="h-[calc(100vh-6rem)]">
            {renderSection()}
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;