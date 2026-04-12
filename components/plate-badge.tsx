import { cn } from "@/lib/utils"

export interface PlateData {
  province?: string  // "CGO", "KIN", etc.
  digits: string     // "5658"
  letters?: string   // "AA"
  year?: string      // "25"
}

interface PlateBadgeProps extends PlateData {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizes = {
  sm: {
    root:     "border-[2.5px] rounded-[3px] text-black",
    left:     "px-1.5 py-0.5 gap-px",
    province: "text-[7px] tracking-widest",
    flag:     "text-[11px] leading-none",
    center:   "px-2.5 py-0.5 text-[11px] tracking-[0.12em]",
    right:    "px-1.5 py-0.5 text-[9px]",
    divider:  "w-px self-stretch",
  },
  md: {
    root:     "border-[3px] rounded-[4px] text-black",
    left:     "px-2 py-1 gap-0.5",
    province: "text-[8px] tracking-widest",
    flag:     "text-[14px] leading-none",
    center:   "px-3 py-1 text-[15px] tracking-[0.15em]",
    right:    "px-2 py-1 text-[11px]",
    divider:  "w-px self-stretch",
  },
  lg: {
    root:     "border-4 rounded-md text-black",
    left:     "px-3 py-1.5 gap-1",
    province: "text-[10px] tracking-widest",
    flag:     "text-xl leading-none",
    center:   "px-5 py-1.5 text-2xl tracking-[0.18em]",
    right:    "px-3 py-1.5 text-sm",
    divider:  "w-px self-stretch",
  },
}

export function PlateBadge({
  province = "KIN",
  digits,
  letters = "AA",
  year,
  size = "md",
  className,
}: PlateBadgeProps) {
  const s = sizes[size]
  const displayYear = year ?? "—"

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden bg-white shadow-sm select-none",
        s.root,
        className,
      )}
      style={{ borderColor: "#111" }}
    >
      {/* Province + flag */}
      <div
        className={cn("flex flex-col items-center justify-center bg-white", s.left)}
      >
        <span className={s.flag}>🇨🇩</span>
        <span className={cn("font-black uppercase leading-none", s.province)}>
          CGO
        </span>
      </div>

      {/* Vertical divider */}
      <div className={s.divider} style={{ backgroundColor: "#111" }} />

      {/* Digits + letters */}
      <div
        className={cn(
          "flex flex-1 items-center justify-center bg-white font-black",
          s.center,
        )}
      >
        {digits}&nbsp;{letters}
      </div>

      {/* Vertical divider */}
      <div className={s.divider} style={{ backgroundColor: "#111" }} />

      {/* Year */}
      <div
        className={cn(
          "flex items-center justify-center bg-white font-black",
          s.right,
        )}
      >
        {displayYear}
      </div>
    </div>
  )
}
