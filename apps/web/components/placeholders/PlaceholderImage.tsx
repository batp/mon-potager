"use client";

import { cn } from "@/lib/utils";

interface PlaceholderBadgeProps {
  className?: string;
}

export function PlaceholderBadge({ className }: PlaceholderBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[#E8A838]/20 px-2 py-0.5 text-xs font-semibold text-[#3D3229]",
        className,
      )}
    >
      Illustration à venir
    </span>
  );
}

interface PlaceholderImageProps {
  type?: "crop" | "icon" | "hero" | "empty";
  name: string;
  emoji?: string;
  showBadge?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-16 w-16 text-2xl",
  md: "h-24 w-24 text-4xl",
  lg: "h-40 w-40 text-6xl",
};

export function PlaceholderImage({
  name,
  emoji = "🌱",
  showBadge = true,
  className,
  size = "md",
}: PlaceholderImageProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl border-2 border-dashed border-[#D4A574] bg-[repeating-linear-gradient(45deg,#E8DFD0_0,#E8DFD0_8px,#F5F0E8_8px,#F5F0E8_16px)]",
          sizeClasses[size],
        )}
        role="img"
        aria-label={`${name} — illustration temporaire`}
      >
        <span aria-hidden="true">{emoji}</span>
      </div>
      <p className="text-sm font-medium text-[#3D3229]">{name}</p>
      {showBadge && <PlaceholderBadge />}
    </div>
  );
}
