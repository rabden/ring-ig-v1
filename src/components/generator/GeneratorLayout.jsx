import React from 'react';
import AuthOverlay from '../AuthOverlay';
import BottomNavbar from '../BottomNavbar';
import ImageGeneratorSettings from '../ImageGeneratorSettings';
import ImageGallery from '../ImageGallery';
import ImageDetailsDialog from '../ImageDetailsDialog';
import FullScreenImageView from '../FullScreenImageView';
import DesktopHeader from '../header/DesktopHeader';
import MobileHeader from '../header/MobileHeader';
import MobileNotificationsMenu from '../MobileNotificationsMenu';
import MobileProfileMenu from '../MobileProfileMenu';

const GeneratorLayout = ({
  session,
  children,
  settings,
  gallery,
  dialogs,
  headers,
  mobile
}) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-2 md:p-6 overflow-y-auto ${settings.activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        {session && headers}
        <div className="md:mt-16 mt-12">
          {gallery}
        </div>
      </div>

      <div className={`w-full md:w-[350px] bg-card text-card-foreground p-4 md:p-6 overflow-y-auto ${settings.activeTab === 'input' ? 'block' : 'hidden md:block'} md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative`}>
        {!session && (
          <div className="absolute inset-0 z-10">
            <AuthOverlay />
          </div>
        )}
        {settings.component}
      </div>

      {mobile}
      {dialogs}
    </div>
  );
};

export default React.memo(GeneratorLayout);