"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    setDeferredPrompt(null);
  };

  return (
    <div className="mx-4 mb-4 flex items-center justify-between gap-3 rounded-2xl border border-[#7BAE7F] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Download className="h-5 w-5 text-[#4A7C59]" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-[#3D3229]">
            Installer Mon Potager
          </p>
          <p className="text-xs text-[#3D3229]/70">
            Accès rapide depuis votre écran d&apos;accueil
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="rounded-xl bg-[#4A7C59] px-3 py-1.5 text-sm font-medium text-white"
        >
          Installer
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-xl p-1.5 text-[#3D3229]/60 hover:bg-[#E8DFD0]"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
