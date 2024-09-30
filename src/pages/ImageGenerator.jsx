import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreVertical } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { modelConfigs, aspectRatios } from '@/utils/modelConfigs'
import Masonry from 'react-masonry-css'
import BottomNavbar from '@/components/BottomNavbar'
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ModelSidebarMenu from '@/components/ModelSidebarMenu'
import { Skeleton } from "@/components/ui/skeleton"
import ImageDetailsDialog from '@/components/ImageDetailsDialog'
import FullScreenImageView from '@/components/FullScreenImageView'
import SignInDialog from '@/components/SignInDialog'
import ProfileMenu from '@/components/ProfileMenu'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import AuthOverlay from '@/components/AuthOverlay'
import { supabase } from '@/integrations/supabase/supabase'
import MobileProfileMenu from '@/components/MobileProfileMenu'
import { deleteImageFromSupabase } from '@/integrations/supabase/imageUtils'

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000))
  const [randomizeSeed, setRandomizeSeed] = useState(true)
  const [width, setWidth] = useState(512)
  const [height, setHeight] = useState(512)
  const [steps, setSteps] = useState(20)
  const [model, setModel] = useState('flux')
  const [quality, setQuality] = useState('SD')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [useAspectRatio, setUseAspectRatio] = useState(true)
  const [generatedImages, setGeneratedImages] = useState([])
  const [activeTab, setActiveTab] = useState('input')
  const [modelSidebarOpen, setModelSidebarOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0)
  const [fullScreenViewOpen, setFullScreenViewOpen] = useState(false)
  const [mobileProfileMenuOpen, setMobileProfileMenuOpen] = useState(false)
  const [isLoadingImages, setIsLoadingImages] = useState(false)

  const { session } = useSupabaseAuth() || {}
  const user = session?.user

  const queryClient = useQueryClient()

  // Define breakpointColumnsObj here
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const { data: userImages, isLoading: isLoadingUserImages } = useQuery({
    queryKey: ['userImages', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!user
  })

  const { data: userCredits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ['userCredits', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credit_count')
        .eq('user_id', user?.id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!user
  })

  const uploadImageMutation = useMutation({
    mutationFn: async ({ blob, ...imageData }) => {
      const fileName = `${user.id}/${Date.now()}.png`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(fileName, blob, { contentType: 'image/png' })
      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('user-images')
        .getPublicUrl(fileName)

      const { data, error } = await supabase
        .from('user_images')
        .insert({
          ...imageData,
          user_id: user.id,
          image_url: publicUrlData.publicUrl,
          storage_path: fileName
        })
        .select()
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userImages', user?.id])
    }
  })

  const updateUserCreditsMutation = useMutation({
    mutationFn: async (newCreditCount) => {
      const { data, error } = await supabase
        .from('user_credits')
        .update({ credit_count: newCreditCount })
        .eq('user_id', user.id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userCredits', user?.id])
    }
  })

  const generateImage = async () => {
    if (!user) {
      console.log("User not signed in")
      return
    }

    if (!prompt) {
      alert('Please enter a prompt')
      return
    }

    const creditCost = qualityOptions[quality].cost
    if (userCredits.credit_count < creditCost) {
      alert(`Not enough credits. You need ${creditCost} credits for this quality.`)
      return
    }

    setIsLoadingImages(true)

    const actualSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed
    const modifiedPrompt = modelConfigs[model].promptSuffix
      ? `${prompt} ${modelConfigs[model].promptSuffix}`
      : prompt

    const newImage = {
      id: Date.now(),
      prompt: modifiedPrompt,
      seed: actualSeed,
      width,
      height,
      steps,
      model,
      quality,
      aspectRatio: useAspectRatio ? aspectRatio : `${width}:${height}`,
      loading: true,
    }

    setGeneratedImages(prev => [newImage, ...prev])

    if (window.innerWidth <= 768) {
      setActiveTab('images')
    }

    const data = {
      inputs: modifiedPrompt,
      parameters: {
        seed: actualSeed,
        width,
        height,
        num_inference_steps: steps
      }
    }

    try {
      const response = await fetch(
        modelConfigs[model].apiUrl,
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      )
      const result = await response.blob()
      const imageUrl = URL.createObjectURL(result)

      setGeneratedImages(prev =>
        prev.map(img =>
          img.id === newImage.id ? { ...img, loading: false, imageUrl } : img
        )
      )

      // Upload the generated image to Supabase
      await uploadImageMutation.mutateAsync({
        blob: result,
        ...newImage,
        imageUrl
      })

      // Update user credits
      updateUserCreditsMutation.mutate(userCredits.credit_count - creditCost)
    } catch (error) {
      console.error('Error generating image:', error)
      setGeneratedImages(prev =>
        prev.map(img =>
          img.id === newImage.id ? { ...img, loading: false, error: true } : img
        )
      )
    } finally {
      setIsLoadingImages(false)
    }
  }

  const handleModelChange = (value) => {
    setModel(value)
    setSteps(modelConfigs[value].defaultStep)
  }

  const handlePromptKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      generateImage()
    }
  }

  const handleDownload = (imageUrl, prompt) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${prompt.slice(0, 20)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDiscard = async (id) => {
    try {
      await deleteImageFromSupabase(id);
      queryClient.invalidateQueries(['userImages', user?.id]);
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image. Please try again.')
    }
  }

  const handleRemix = (image) => {
    setPrompt(image.prompt)
    setSeed(image.seed)
    setRandomizeSeed(false)
    setWidth(image.width)
    setHeight(image.height)
    setSteps(image.steps)
    setModel(image.model)
    setQuality(image.quality)
    setAspectRatio(image.aspect_ratio)
    setUseAspectRatio(image.aspect_ratio in aspectRatios)
    setActiveTab('input')
  }

  const handleViewDetails = (image) => {
    setSelectedImage(image)
    setDetailsDialogOpen(true)
  }

  const handleImageClick = (index) => {
    setFullScreenImageIndex(index)
    setFullScreenViewOpen(true)
  }

  const handleFullScreenNavigate = (direction) => {
    if (direction === 'prev' && fullScreenImageIndex > 0) {
      setFullScreenImageIndex(fullScreenImageIndex - 1)
    } else if (direction === 'next' && fullScreenImageIndex < userImages.length - 1) {
      setFullScreenImageIndex(fullScreenImageIndex + 1)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        <div className="flex justify-between items-center mb-6">
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <ProfileMenu user={user} />
            </div>
          ) : (
            <div className="hidden md:block">
              <SignInDialog />
            </div>
          )}
        </div>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto"
          columnClassName="bg-clip-padding px-2"
        >
          {isLoadingImages || isLoadingUserImages ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="mb-4">
                <Skeleton className="w-full h-64" />
              </div>
            ))
          ) : (
            (userImages || []).map((image, index) => (
              <div key={image.id} className="mb-4">
                <Card className="overflow-hidden">
                  <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
                    {image.loading ? (
                      <Skeleton className="absolute inset-0 w-full h-full" />
                    ) : (
                      <img 
                        src={image.image_url} 
                        alt={image.prompt} 
                        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                        onClick={() => handleImageClick(index)}
                      />
                    )}
                  </CardContent>
                </Card>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm truncate w-[70%] mr-2">{image.prompt}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(image.image_url, image.prompt)}>
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDiscard(image.id)}>
                        Discard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemix(image)}>
                        Remix
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewDetails(image)}>
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </Masonry>
      </div>
      <div className={`w-full md:w-[350px] bg-card text-card-foreground p-6 overflow-y-auto ${activeTab === 'input' ? 'block' : 'hidden md:block'} md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative`}>
        {!user && <AuthOverlay />}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Settings</h2>
          {isLoadingCredits ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <span className="text-sm font-medium">Credits: {userCredits?.credit_count || 0}</span>
          )}
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promptInput">Prompt</Label>
            <Textarea
              id="promptInput"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handlePromptKeyDown}
              placeholder="Enter your prompt here"
              className="min-h-[100px] resize-y"
            />
          </div>
          <Button 
            onClick={generateImage} 
            className="w-full" 
            disabled={!user || (userCredits && userCredits.credit_count < qualityOptions[quality].cost)}
          >
            Generate Image
          </Button>
          {user && userCredits && userCredits.credit_count < qualityOptions[quality].cost && (
            <p className="text-sm text-destructive">Not enough credits for this quality.</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="modelSelect">Model</Label>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setModelSidebarOpen(true)}
            >
              {modelConfigs[model].name}
              <span className="ml-2 opacity-50">{modelConfigs[model].category}</span>
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seedInput">Seed</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="seedInput"
                type="number"
                value={seed}
                onChange={(e) => setSeed(parseInt(e.target.value))}
                disabled={randomizeSeed}
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id="randomizeSeed"
                  checked={randomizeSeed}
                  onCheckedChange={setRandomizeSeed}
                />
                <Label htmlFor="randomizeSeed">Random</Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Quality</Label>
            <Tabs value={quality} onValueChange={setQuality}>
              <TabsList className="grid grid-cols-4 w-full">
                {Object.keys(qualityOptions).map((q) => (
                  <TabsTrigger key={q} value={q}>{q}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Use Aspect Ratio</Label>
              <Switch
                checked={useAspectRatio}
                onCheckedChange={setUseAspectRatio}
              />
            </div>
            {useAspectRatio && (
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(aspectRatios).map((ratio) => (
                  <Button
                    key={ratio}
                    variant={aspectRatio === ratio ? "default" : "outline"}
                    className="w-full text-xs py-1 px-2"
                    onClick={() => setAspectRatio(ratio)}
                  >
                    {ratio}
                  </Button>
                ))}
              </div>
            )}
            {!useAspectRatio && (
              <>
                <div className="space-y-2">
                  <Label>Width: {width}px</Label>
                  <Slider
                    min={256}
                    max={qualityOptions[quality].size}
                    step={8}
                    value={[width]}
                    onValueChange={(value) => setWidth(value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height: {height}px</Label>
                  <Slider
                    min={256}
                    max={qualityOptions[quality].size}
                    step={8}
                    value={[height]}
                    onValueChange={(value) => setHeight(value[0])}
                  />
                </div>
              </>
            )}
          </div>
          <div className="space-y-2">
            <Label>Inference Steps</Label>
            <Tabs value={steps.toString()} onValueChange={(value) => setSteps(parseInt(value))}>
              <TabsList className="grid grid-cols-5 w-full">
                {modelConfigs[model].inferenceSteps.map((step) => (
                  <TabsTrigger key={step} value={step.toString()}>
                    {step}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      <BottomNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openProfileMenu={() => setMobileProfileMenuOpen(true)}
      />
      <MobileProfileMenu
        isOpen={mobileProfileMenuOpen}
        onClose={() => setMobileProfileMenuOpen(false)}
        user={user}
        userCredits={userCredits}
      />
      <ModelSidebarMenu
        isOpen={modelSidebarOpen}
        onClose={() => setModelSidebarOpen(false)}
        onSelectModel={handleModelChange}
        currentModel={model}
      />
      <ImageDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        image={selectedImage}
      />
      <FullScreenImageView
        images={userImages || []}
        currentIndex={fullScreenImageIndex}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onNavigate={handleFullScreenNavigate}
      />
    </div>
  )
}

export default ImageGenerator