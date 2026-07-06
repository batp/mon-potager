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

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8DFD0] bg-[#F5F0E8]/95 backdrop-blur md:hidden"
      aria-label="Navigation principale"
    >
      <ul className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/" && pathname.startsWith(`${href}/`));
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-xs font-medium transition-colors",
                  active
                    ? "text-[#2D5A3D]"
                    : "text-[#3D3229]/70 hover:text-[#4A7C59]",
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" aria-hidden />
                  {href === "/calendrier" && (
                    <NavTaskBadge className="absolute -top-1 -right-2" />
                  )}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
