"use client";

import { Bell, BellOff } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { cn } from "@/lib/utils";

export function PushSettings() {
  const {
    supported,
    configured,
    enabled,
    loading,
    error,
    enable,
    disable,
  } = usePushNotifications();

  if (!supported) {
    return (
      <p className="text-sm text-[#3D3229]/60">
        Notifications non supportées sur ce navigateur.
      </p>
    );
  }

  if (!configured) {
    return (
      <p className="text-sm text-[#3D3229]/60">
        Rappels push : configurez{" "}
        <code className="rounded bg-[#E8DFD0]/50 px-1 text-xs">
          NEXT_PUBLIC_VAPID_PUBLIC_KEY
        </code>{" "}
        dans <code className="rounded bg-[#E8DFD0]/50 px-1 text-xs">.env.local</code>.
        Fonctionne après build PWA (pas en dev).
      </p>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-[#7BAE7F]/40 bg-white/90 p-4">
      <div className="flex items-start gap-3">
        {enabled ? (
          <Bell className="mt-0.5 h-5 w-5 text-[#4A7C59]" aria-hidden />
        ) : (
          <BellOff className="mt-0.5 h-5 w-5 text-[#3D3229]/50" aria-hidden />
        )}
        <div className="flex-1">
          <p className="font-semibold text-[#2D5A3D]">Rappels du calendrier</p>
          <p className="mt-1 text-sm text-[#3D3229]/70">
            Recevez une notification pour les tâches du jour (PWA installée
            recommandée).
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-[#D9534F]/10 px-3 py-2 text-sm text-[#D9534F]">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={loading}
        onClick={() => void (enabled ? disable() : enable())}
        className={cn(
          "w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50",
          enabled
            ? "border border-[#E8DFD0] text-[#3D3229]"
            : "bg-[#4A7C59] text-white",
        )}
      >
        {loading
          ? "…"
          : enabled
            ? "Désactiver les rappels"
            : "Activer les rappels"}
      </button>
    </div>
  );
}
