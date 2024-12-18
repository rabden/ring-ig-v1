import React from 'react'
import { Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Inspiration({ onClick }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="group"
      onClick={onClick}>
      <Lightbulb className="h-5 w-5 text-white/50 transition-colors duration-200 group-hover:text-white" />
    </Button>
  )
}