"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, Sprout, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavTaskBadge } from "@/components/shared/NavTaskBadge";

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/potager", label: "Potager", icon: Sprout },
  { href: "/calendrier", label: "Calendrier", icon: Calendar },
  { href: "/communaute", label: "Communauté", icon: Users },
  { href: "/profil", label: "Profil", icon: User },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-[#E8DFD0] bg-[#F5F0E8] md:flex md:flex-col">
      <div className="border-b border-[#E8DFD0] px-4 py-5">
        <p className="text-lg font-bold text-[#2D5A3D]">Mon Potager</p>
        <p className="text-xs text-[#3D3229]/60">beta · PWA</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navigation principale">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#4A7C59] text-white"
                  : "text-[#3D3229] hover:bg-[#E8DFD0]/60",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
              {href === "/calendrier" && <NavTaskBadge />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
