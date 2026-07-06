"use client";

import { useRouter } from "next/navigation";
import { PushSettings } from "@/components/profil/PushSettings";
import { useAuth } from "@/components/providers/AuthProvider";

function getInitials(name: string) {
  return name
    .split(/[\s_]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfilContent() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
    router.refresh();
  };

  if (loading) {
    return <p className="text-sm text-[#3D3229]/60">Chargement…</p>;
  }

  if (!user) {
    return null;
  }

  const displayName = profile?.username ?? user.email?.split("@")[0] ?? "Jardinier";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#2D5A3D]">Profil</h1>
        <p className="text-sm text-[#3D3229]/70">Compte de test connecté</p>
      </header>

      <div className="flex items-center gap-4 rounded-2xl bg-white/80 p-4 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7BAE7F] text-xl font-bold text-white">
          {getInitials(displayName)}
        </div>
        <div>
          <p className="font-semibold text-[#3D3229]">{displayName}</p>
          <p className="text-sm text-[#3D3229]/60">{user.email}</p>
          {profile?.city && (
            <p className="text-xs text-[#3D3229]/50">{profile.city}</p>
          )}
        </div>
      </div>

      {profile?.bio && (
        <p className="rounded-2xl bg-white/60 p-4 text-sm text-[#3D3229]/80">
          {profile.bio}
        </p>
      )}

      <PushSettings />

      <button
        type="button"
        onClick={handleSignOut}
        className="w-full rounded-xl border border-[#D9534F]/40 px-4 py-3 text-sm font-semibold text-[#D9534F]"
      >
        Se déconnecter
      </button>
    </div>
  );
}
