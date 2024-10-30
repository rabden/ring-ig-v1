import React from 'react';
import { BarChart3, Users, Image, Settings, LogOut } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import AnalyticsOverview from './AnalyticsOverview';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
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
        {/* Sidebar */}
        <aside className="w-64 border-r h-[calc(100vh-4rem)] p-4 bg-card">
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
              <span>Analytics</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent">
              <Users className="h-5 w-5" />
              <span>Users</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent">
              <Image className="h-5 w-5" />
              <span>Images</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <ScrollArea className="h-[calc(100vh-6rem)]">
            <AnalyticsOverview />
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;