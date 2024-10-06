import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { X, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()
  const [showMobileToast, setShowMobileToast] = useState(false)

  return (
    <>
      <Sonner
        theme={theme}
        className="toaster group hidden md:block"
        position="bottom-left"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
        closeButton={(id) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              props.dismiss?.(id)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {...props}
      />
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowMobileToast(!showMobileToast)}
        >
          <Bell className="h-4 w-4" />
        </Button>
      </div>
      {showMobileToast && (
        <Sonner
          theme={theme}
          className="toaster group md:hidden"
          position="top-right"
          toastOptions={{
            classNames: {
              toast:
                "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
              description: "group-[.toast]:text-muted-foreground",
              actionButton:
                "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
              cancelButton:
                "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            },
          }}
          closeButton={(id) => (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                props.dismiss?.(id)
                setShowMobileToast(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {...props}
        />
      )}
    </>
  )
}

export { Toaster }