import React from 'react'
import { Drawer } from 'vaul'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import SignInDialog from '@/components/SignInDialog'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import { User, X } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

const MobileProfileMenu = ({ user, credits, bonusCredits }) => {
  const { logout } = useSupabaseAuth()
  const [open, setOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          ) : (
            <User size={20} />
          )}
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[60] mt-24 flex flex-col rounded-t-[10px] bg-background">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-full"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-md mx-auto space-y-6">
              {user ? (
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
                    <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">
                      {user.user_metadata.display_name || user.email}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-bold">{credits}</span>
                    {bonusCredits > 0 && (
                      <>
                        <span className="text-muted-foreground">+</span>
                        <span className="text-sm font-medium text-muted-foreground">
                          {bonusCredits} bonus
                        </span>
                      </>
                    )}
                    <span className="text-sm text-muted-foreground ml-1">credits</span>
                  </div>
                  <Button onClick={handleLogout} variant="outline" className="w-full">
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <SignInDialog />
                </div>
              )}
            </div>
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default MobileProfileMenu