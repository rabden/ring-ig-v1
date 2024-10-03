import React, { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BottomNavbar from '@/components/BottomNavbar'
import ImageDetailsDialog from '@/components/ImageDetailsDialog'
import FullScreenImageView from '@/components/FullScreenImageView'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import AuthOverlay from '@/components/AuthOverlay'
import { useUserCredits } from '@/hooks/useUserCredits'
import ProfileMenu from '@/components/ProfileMenu'
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings'
import ImageGallery from '@/components/ImageGallery'

const ImageGenerator = () => {
  const [activeTab, setActiveTab] = useState('myImages')
  const [selectedImage, setSelectedImage] = useState(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [fullScreenViewOpen, setFullScreenViewOpen] = useState(false)
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0)
  const { session } = useSupabaseAuth()
  const { credits } = useUserCredits(session?.user?.id)

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className="flex-grow p-6 overflow-y-auto md:pr-[350px] pb-20 md:pb-6">
        <div className="flex justify-between items-center mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="myImages">My Images</TabsTrigger>
              <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
            </TabsList>
          </Tabs>
          {session && (
            <div className="hidden md:block">
              <ProfileMenu user={session.user} credits={credits} />
            </div>
          )}
        </div>
        <ImageGallery userId={session?.user?.id} isMyImages={activeTab === 'myImages'} />
      </div>
      <Card className="w-full md:w-[350px] bg-card text-card-foreground p-6 overflow-y-auto md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative">
        {!session && (
          <div className="absolute inset-0 z-10">
            <AuthOverlay />
          </div>
        )}
        <ImageGeneratorSettings />
      </Card>
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} session={session} credits={credits} />
      <ImageDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        image={selectedImage}
      />
      <FullScreenImageView
        images={[]} // This should be updated to use the correct images array
        currentIndex={fullScreenImageIndex}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onNavigate={() => {}} // This should be updated with the correct navigation function
      />
    </div>
  )
}

export default ImageGenerator