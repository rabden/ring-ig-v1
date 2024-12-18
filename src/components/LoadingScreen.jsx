import { cn } from "@/lib/utils"

export default function LoadingScreen({ className }) {
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />
        <p className="text-sm text-white/70">Loading...</p>
      </div>
    </div>
  )
}