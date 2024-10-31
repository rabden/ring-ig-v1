import React from 'react'
import { Label } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const GeneratingImagesDropdown = ({ generatingImages }) => {
  if (!generatingImages?.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Label className="w-4 h-4 mr-2" />
          Generating-{generatingImages.length}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {generatingImages.map((img) => (
          <DropdownMenuItem key={img.id} className="justify-between">
            <span className="truncate">Generating...</span>
            <Badge variant="secondary" className="ml-2">
              {img.width}x{img.height}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GeneratingImagesDropdown;