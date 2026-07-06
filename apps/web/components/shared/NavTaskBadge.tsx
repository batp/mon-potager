"use client";

import { usePendingTaskCount } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";

export function NavTaskBadge({ className }: { className?: string }) {
  const { data: count } = usePendingTaskCount();

  if (!count || count <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full bg-[#E8A838] px-1.5 text-[10px] font-bold text-[#3D3229]",
        className,
      )}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
