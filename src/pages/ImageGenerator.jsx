import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import { useUserCredits } from '@/hooks/useUserCredits'
import ProfileMenu from '@/components/ProfileMenu'
import MyImages from '@/components/MyImages'
import Inspiration from '@/components/Inspiration'
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings'
import ImageGallery from '@/components/ImageGallery'

const ImageGenerator = () => {
  const [currentView, setCurrentView] = useState('myImages')
  const { session } = useSupabaseAuth()
  const { credits } = useUserCredits(session?.user?.id)

  const renderContent = () => {
    switch (currentView) {
      case 'myImages':
        return <ImageGallery userId={session?.user?.id} isMyImages={true} />
      case 'inspiration':
        return <ImageGallery userId={session?.user?.id} isMyImages={false} />
      case 'generator':
        return <ImageGeneratorSettings />
      default:
        return <ImageGallery userId={session?.user?.id} isMyImages={true} />
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex justify-between items-center p-4 bg-card">
        <div className="flex items-center space-x-4">
          {session && (
            <ProfileMenu user={session.user} credits={credits} />
          )}
          <div className="flex space-x-2">
            <Button
              variant={currentView === 'myImages' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('myImages')}
            >
              My Images
            </Button>
            <Button
              variant={currentView === 'inspiration' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('inspiration')}
            >
              Inspiration
            </Button>
          </div>
        </div>
        <Button
          variant={currentView === 'generator' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentView('generator')}
        >
          Generate
        </Button>
      </header>
      <main className="flex-grow p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  )
}

export default ImageGenerator