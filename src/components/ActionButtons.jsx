import React from 'react'
import { Button } from "@/components/ui/button"

const ActionButtons = ({ activeView, setActiveView }) => {
  return (
    <div className="hidden md:flex space-x-2">
      <Button
        variant={activeView === 'myImages' ? 'default' : 'outline'}
        onClick={() => setActiveView('myImages')}
        className="text-xs px-2 py-1 h-8"
      >
        My Images
      </Button>
      <Button
        variant={activeView === 'inspiration' ? 'default' : 'outline'}
        onClick={() => setActiveView('inspiration')}
        className="text-xs px-2 py-1 h-8"
      >
        Inspiration
      </Button>
    </div>
  )
}

export default ActionButtons