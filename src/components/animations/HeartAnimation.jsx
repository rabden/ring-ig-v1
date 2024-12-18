import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HeartAnimation({ className }) {
  return (
    <div className={cn("relative", className)}>
      <Heart className="absolute h-5 w-5 animate-ping text-red-500 opacity-75" />
      <Heart className="h-5 w-5 text-red-500" />
    </div>
  )
}