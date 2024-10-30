import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'

const UsersList = () => {
  const queryClient = useQueryClient()

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('user_credits')
        .select(`
          *,
          user:auth.users (
            id,
            email,
            created_at
          )
        `)
      if (error) throw error
      return users
    }
  })

  const updateCreditsMutation = useMutation({
    mutationFn: async ({ userId, credits }) => {
      const { error } = await supabase
        .from('user_credits')
        .update({ credit_count: credits })
        .eq('user_id', userId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      toast.success('Credits updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update credits: ' + error.message)
    }
  })

  const handleUpdateCredits = (userId, credits) => {
    updateCreditsMutation.mutate({ userId, credits: parseInt(credits) })
  }

  if (isLoading) {
    return <div>Loading users...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Bonus Credits</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((userCredit) => (
            <TableRow key={userCredit.user_id}>
              <TableCell>{userCredit.user?.email}</TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  defaultValue={userCredit.credit_count}
                  className="w-24"
                  onBlur={(e) => handleUpdateCredits(userCredit.user_id, e.target.value)}
                />
              </TableCell>
              <TableCell>{userCredit.bonus_credits}</TableCell>
              <TableCell>{new Date(userCredit.user?.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateCredits(userCredit.user_id, 50)}
                >
                  Reset Credits
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default UsersList