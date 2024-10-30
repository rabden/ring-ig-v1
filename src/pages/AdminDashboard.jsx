import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from "sonner"

const AdminDashboard = () => {
  const [adminId, setAdminId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminId === 'Rabiul') {
      setIsAuthenticated(true);
      toast.success("Welcome to Admin Dashboard");
    } else {
      toast.error("Invalid Admin ID");
    }
  };

  if (isAuthenticated) {
    return <AdminLayout />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground mt-2">Please enter your Admin ID</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Enter Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;