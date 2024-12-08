import React, { useState } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import ImageGallery from '@/components/ImageGallery';
import DesktopHeader from '@/components/header/DesktopHeader';
import MobileHeader from '@/components/header/MobileHeader';
import ImageDetailsDialog from '@/components/ImageDetailsDialog';
import FullScreenImageView from '@/components/FullScreenImageView';
import BottomNavbar from '@/components/BottomNavbar';
import MobileNotificationsMenu from '@/components/MobileNotificationsMenu';
import MobileProfileMenu from '@/components/MobileProfileMenu';
import { useNavigate } from 'react-router-dom';
import { useUserCredits } from '@/hooks/useUserCredits';

const Inspiration = () => {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [fullScreenViewOpen, setFullScreenViewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [nsfwEnabled, setNsfwEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('images');
  const [activeView, setActiveView] = useState('inspiration');
  const { credits, bonusCredits } = useUserCredits(session?.user?.id);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setFullScreenViewOpen(true);
  };

  const handleViewDetails = (image) => {
    setSelectedImage(image);
    setDetailsDialogOpen(true);
  };

  const handleRemix = async (image) => {
    navigate(`/remix/${image.id}`);
  };

  const handleDownload = async (image) => {
    // Download logic
    const response = await fetch(image.image_url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${image.id}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <DesktopHeader
        user={session?.user}
        credits={credits}
        bonusCredits={bonusCredits}
        activeView="inspiration"
        onSearch={setSearchQuery}
        nsfwEnabled={nsfwEnabled}
      />

      {/* Mobile Header */}
      <MobileHeader
        activeFilters={activeFilters}
        onFilterChange={(type, value) => setActiveFilters(prev => ({ ...prev, [type]: value }))}
        onRemoveFilter={(type) => {
          const newFilters = { ...activeFilters };
          delete newFilters[type];
          setActiveFilters(newFilters);
        }}
        onSearch={setSearchQuery}
        isVisible={true}
        nsfwEnabled={nsfwEnabled}
        onToggleNsfw={() => setNsfwEnabled(!nsfwEnabled)}
        activeView="inspiration"
      />

      {/* Main Content */}
      <main className="pt-12 px-4 md:px-6 pb-20 md:pb-6">
        <ImageGallery
          userId={session?.user?.id}
          onImageClick={handleImageClick}
          onDownload={handleDownload}
          onRemix={handleRemix}
          onViewDetails={handleViewDetails}
          activeView="inspiration"
          nsfwEnabled={nsfwEnabled}
          activeFilters={activeFilters}
          searchQuery={searchQuery}
        />
      </main>

      {/* Mobile Navigation */}
      <BottomNavbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        session={session}
        credits={credits}
        bonusCredits={bonusCredits}
        activeView={activeView}
        setActiveView={setActiveView}
        generatingImages={[]}
      />
      <MobileNotificationsMenu activeTab={activeTab} />
      <MobileProfileMenu 
        user={session?.user}
        credits={credits}
        bonusCredits={bonusCredits}
        activeTab={activeTab}
      />

      {/* Dialogs */}
      <ImageDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        image={selectedImage}
      />
      <FullScreenImageView
        image={selectedImage}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onDownload={handleDownload}
        onRemix={handleRemix}
        isOwner={selectedImage?.user_id === session?.user?.id}
      />
    </div>
  );
};

export default Inspiration; 