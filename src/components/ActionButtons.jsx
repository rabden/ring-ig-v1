import React from 'react'
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from 'react-router-dom'
import GeneratingImagesDropdown from './GeneratingImagesDropdown'
import { cn } from '@/lib/utils'

const ActionButtons = ({ generatingImages }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInspiration = location.pathname === '/inspiration';
  const isMyImages = location.pathname === '/' && (!location.hash || location.hash === '#myimages');

  return (
    <div className="hidden md:flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={() => navigate('/#myimages')}
        className={cn(
          "text-xs px-3 py-1 h-8 transition-all duration-200",
          "hover:bg-accent/40 hover:text-accent-foreground",
          isMyImages && "bg-accent/30 text-accent-foreground"
        )}
        aria-pressed={isMyImages}
      >
        My Images
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate('/inspiration')}
        className={cn(
          "text-xs px-3 py-1 h-8 transition-all duration-200",
          "hover:bg-accent/40 hover:text-accent-foreground",
          isInspiration && "bg-accent/30 text-accent-foreground"
        )}
        aria-pressed={isInspiration}
      >
        Inspiration
      </Button>
      <GeneratingImagesDropdown generatingImages={generatingImages} />
    </div>
  )
}

export default ActionButtons