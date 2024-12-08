import React from 'react'
import { Button } from "@/components/ui/button"
import GeneratingImagesDropdown from './GeneratingImagesDropdown'

const ActionButtons = ({ activeView, setActiveView, generatingImages }) => {
  return (
    <div className="hidden md:flex items-center space-x-2">
      <Button
        variant={activeView === 'myImages' ? 'default' : 'outline'}
        onClick={() => setActiveView('myImages')}
        className="text-xs px-2 py-1 h-8 transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-pressed={activeView === 'myImages'}
      >
        My Images
      </Button>
      <Button
        variant={activeView === 'inspiration' ? 'default' : 'outline'}
        onClick={() => setActiveView('inspiration')}
        className="text-xs px-2 py-1 h-8 transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-pressed={activeView === 'inspiration'}
      >
        Inspiration
      </Button>
      <GeneratingImagesDropdown generatingImages={generatingImages} />
    </div>
  )
}

export default ActionButtons