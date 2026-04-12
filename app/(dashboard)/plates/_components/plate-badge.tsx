import { cn } from "@/lib/utils"

interface PlateBadgeProps {
  number: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeConfig = {
  sm: { wrapper: "h-7 w-16", strip: "w-4 text-[7px]", number: "text-xs tracking-widest" },
  md: { wrapper: "h-9 w-20", strip: "w-5 text-[8px]", number: "text-sm tracking-widest" },
  lg: { wrapper: "h-12 w-28", strip: "w-7 text-[10px]", number: "text-base tracking-[0.2em]" },
}

export function PlateBadge({ number, size = "md", className }: PlateBadgeProps) {
  const s = sizeConfig[size]
  return (
    <div
      className={cn(
        "flex overflow-hidden rounded border-2 border-foreground/80 bg-white shadow-sm dark:border-foreground/60",
        s.wrapper,
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 flex-col items-center justify-center gap-px bg-blue-700 font-bold text-white",
          s.strip,
        )}
      >
        <span>R</span>
        <span>D</span>
        <span>C</span>
      </div>
      <div
        className={cn(
          "flex flex-1 items-center justify-center font-mono font-bold text-gray-900",
          s.number,
        )}
      >
        {number}
      </div>
    </div>
  )
}
