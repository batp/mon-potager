import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <WifiOff className="h-12 w-12 text-[#4A7C59]" aria-hidden />
      <h1 className="text-xl font-bold text-[#2D5A3D]">Vous êtes hors ligne</h1>
      <p className="max-w-sm text-sm text-[#3D3229]/70">
        Certaines pages restent accessibles grâce au cache PWA. Reconnectez-vous
        pour synchroniser vos données.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-[#4A7C59] px-4 py-2 text-sm font-semibold text-white"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
