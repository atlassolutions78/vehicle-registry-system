"use client"

import { Check, X } from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-right"
      closeButton
      icons={{
        success: (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-green-500">
            <Check className="size-4 text-white stroke-[2.5]" />
          </span>
        ),
        error: (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-red-500">
            <X className="size-4 text-white stroke-[2.5]" />
          </span>
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-3 rounded-xl px-4 py-3.5 shadow-xl bg-[#1c2419] text-white text-sm font-medium",
          title: "flex-1 leading-snug",
          closeButton:
            "!relative !top-auto !right-auto !left-auto !translate-y-0 !translate-x-0 ml-auto shrink-0 !size-6 !bg-transparent !border-0 flex items-center justify-center text-white/40 hover:text-white transition-colors [&_svg]:size-3.5",
        },
      }}
      {...props}
    />
  )
}
