import React, { useState } from 'react'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UsersList from '@/components/admin/UsersList'
import ImagesList from '@/components/admin/ImagesList'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'

const ADMIN_EMAILS = ['admin@example.com'] // Add your admin emails here

const AdminDashboard = () => {
  const { session } = useSupabaseAuth()
  
  // Check if user is admin
  const isAdmin = session?.user && ADMIN_EMAILS.includes(session.user.email)
  
  if (!session) {
    return <Navigate to="/" replace />
  }
  
  if (!isAdmin) {
    toast.error("You don't have permission to access this page")
    return <Navigate to="/" replace />
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UsersList />
        </TabsContent>
        
        <TabsContent value="images">
          <ImagesList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard