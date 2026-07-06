"use client";

import Link from "next/link";
import { Calendar, Sprout, Users, ArrowLeftRight } from "lucide-react";
import { PlaceholderImage } from "@/components/placeholders/PlaceholderImage";
import { PwaInstallPrompt } from "@/components/shared/PwaInstallPrompt";
import { useAuth } from "@/components/providers/AuthProvider";

const shortcuts = [
  {
    href: "/potager",
    label: "Mon potager",
    icon: Sprout,
    color: "bg-[#7BAE7F]/30",
  },
  {
    href: "/calendrier",
    label: "Calendrier",
    icon: Calendar,
    color: "bg-[#F2D06B]/30",
  },
  {
    href: "/communaute",
    label: "Communauté",
    icon: Users,
    color: "bg-[#D4A574]/30",
  },
  {
    href: "#",
    label: "Troc & don",
    icon: ArrowLeftRight,
    color: "bg-[#E8DFD0]",
    disabled: true,
  },
];

export function HomeTiles() {
  const { profile } = useAuth();
  const greetingName = profile?.username;

  return (
    <div className="space-y-6">
      <PwaInstallPrompt />

      <section className="flex flex-col items-center gap-4 text-center">
        <p className="text-2xl font-bold text-[#2D5A3D]">
          {greetingName ? `Bonjour ${greetingName} ! ☀️` : "Bonjour ! ☀️"}
        </p>
        <PlaceholderImage
          type="hero"
          name="Votre jardin"
          emoji="🧑‍🌾"
          size="lg"
        />
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4">
        {shortcuts.map(({ href, label, icon: Icon, color, disabled }) =>
          disabled ? (
            <div
              key={label}
              className={`relative flex flex-col items-center gap-2 rounded-2xl p-4 opacity-60 ${color}`}
            >
              <Icon className="h-8 w-8 text-[#2D5A3D]" aria-hidden />
              <span className="text-sm font-semibold text-[#3D3229]">
                {label}
              </span>
              <span className="rounded-full bg-[#E8A838]/30 px-2 py-0.5 text-xs font-medium">
                Bientôt
              </span>
            </div>
          ) : (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-transform hover:scale-[1.02] ${color}`}
            >
              <Icon className="h-8 w-8 text-[#2D5A3D]" aria-hidden />
              <span className="text-sm font-semibold text-[#3D3229]">
                {label}
              </span>
            </Link>
          ),
        )}
      </section>

      <section className="rounded-2xl border border-[#7BAE7F]/40 bg-white/80 p-4">
        <p className="mb-1 text-sm font-semibold text-[#2D5A3D]">
          Conseil du jour
        </p>
        <p className="text-sm text-[#3D3229]/80">
          Pensez à pailler vos tomates avant les premières chaleurs.
        </p>
      </section>
    </div>
  );
}
