import React from 'react'
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from 'react-router-dom'
import GeneratingImagesDropdown from './GeneratingImagesDropdown'

const ActionButtons = ({ generatingImages }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInspiration = location.pathname === '/inspiration';
  const isMyImages = location.pathname === '/' && (!location.hash || location.hash === '#myimages');

  return (
    <div className="hidden md:flex items-center space-x-2">
      <Button
        variant={isMyImages ? 'default' : 'outline'}
        onClick={() => navigate('/#myimages')}
        className="text-xs px-2 py-1 h-8 transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-pressed={isMyImages}
      >
        My Images
      </Button>
      <Button
        variant={isInspiration ? 'default' : 'outline'}
        onClick={() => navigate('/inspiration')}
        className="text-xs px-2 py-1 h-8 transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-pressed={isInspiration}
      >
        Inspiration
      </Button>
      <GeneratingImagesDropdown generatingImages={generatingImages} />
    </div>
  )
}

export default ActionButtons