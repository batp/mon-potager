"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/shared/BottomNav";
import { PlaceholderBanner } from "@/components/shared/PlaceholderBanner";
import { SidebarNav } from "@/components/shared/SidebarNav";

const AUTH_PREFIX = "/auth";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith(AUTH_PREFIX);

  if (isAuthPage) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    );
  }

  return (
    <>
      <PlaceholderBanner />
      <div className="mx-auto flex min-h-dvh max-w-6xl">
        <SidebarNav />
        <div className="flex min-h-dvh flex-1 flex-col">
          <main className="flex-1 px-4 pb-24 pt-4 md:pb-8">{children}</main>
          <BottomNav />
        </div>
      </div>
    </>
  );
}
