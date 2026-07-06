"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineBanner() {
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 border-b border-[#E8A838]/50 bg-[#E8A838]/20 px-4 py-2 text-sm text-[#3D3229]"
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden />
      <span>
        Mode hors ligne — consultation du potager et du calendrier en cache.
        La synchronisation reprendra à la reconnexion.
      </span>
    </div>
  );
}
