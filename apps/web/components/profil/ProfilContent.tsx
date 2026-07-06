"use client";

import { useRouter } from "next/navigation";
import { PushSettings } from "@/components/profil/PushSettings";
import { ProfileForm } from "@/components/profil/ProfileForm";
import { Avatar } from "@/components/shared/Avatar";
import { useAuth } from "@/components/providers/AuthProvider";

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
        <Avatar
          name={displayName}
          url={profile?.avatar_url}
          size="lg"
        />
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

      <ProfileForm />

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
