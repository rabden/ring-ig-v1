import React from 'react'
import { Button } from "@/components/ui/button"
import GeneratingImagesDropdown from './GeneratingImagesDropdown'
import { useNavigate, useLocation } from 'react-router-dom'

const ActionButtons = ({ activeView, setActiveView, generatingImages }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleNavigation = (path) => {
    navigate(path);
    if (setActiveView) {
      setActiveView(path === '/' ? 'myImages' : 'inspiration');
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-2">
      <Button
        variant={currentPath === '/' ? 'default' : 'outline'}
        onClick={() => handleNavigation('/')}
        className="text-xs px-2 py-1 h-8 transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-pressed={currentPath === '/'}
      >
        My Images
      </Button>
      <Button
        variant={currentPath === '/inspiration' ? 'default' : 'outline'}
        onClick={() => handleNavigation('/inspiration')}
        className="text-xs px-2 py-1 h-8 transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-pressed={currentPath === '/inspiration'}
      >
        Inspiration
      </Button>
      <GeneratingImagesDropdown generatingImages={generatingImages} />
    </div>
  )
}

export default ActionButtons