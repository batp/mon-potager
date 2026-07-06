"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProfileUpdate } from "@/hooks/useProfile";

export function ProfileForm() {
  const { user, profile } = useAuth();
  const updateProfile = useProfileUpdate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setUsername(profile.username ?? "");
    setBio(profile.bio ?? "");
    setCity(profile.city ?? "");
    setRegion(profile.region ?? "");
  }, [profile]);

  const displayName = profile?.username ?? user?.email?.split("@")[0] ?? "Jardinier";

  const handleAvatar = (file: File | null) => {
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    setError(null);
    setSaved(false);
    try {
      await updateProfile.mutateAsync({
        username,
        bio,
        city,
        region,
        avatarFile,
      });
      setSaved(true);
      setAvatarFile(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-[#7BAE7F]/40 bg-white/90 p-4">
      <h2 className="font-semibold text-[#2D5A3D]">Modifier le profil</h2>

      <div className="flex items-center gap-4">
        <Avatar
          name={displayName}
          url={avatarPreview ?? profile?.avatar_url}
          size="lg"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 rounded-xl border border-[#E8DFD0] px-3 py-2 text-sm text-[#3D3229]/70"
        >
          <Camera className="h-4 w-4" />
          Changer l&apos;avatar
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleAvatar(e.target.files?.[0] ?? null)}
        />
      </div>

      <label className="block space-y-1">
        <span className="text-xs font-medium text-[#3D3229]/60">Pseudo</span>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={30}
          className="w-full rounded-xl border border-[#E8DFD0] bg-white px-3 py-2 text-sm outline-none focus:border-[#7BAE7F]"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-medium text-[#3D3229]/60">Bio</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={280}
          rows={3}
          className="w-full resize-none rounded-xl border border-[#E8DFD0] bg-white px-3 py-2 text-sm outline-none focus:border-[#7BAE7F]"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-xs font-medium text-[#3D3229]/60">Ville</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border border-[#E8DFD0] bg-white px-3 py-2 text-sm outline-none focus:border-[#7BAE7F]"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-[#3D3229]/60">Région</span>
          <input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-xl border border-[#E8DFD0] bg-white px-3 py-2 text-sm outline-none focus:border-[#7BAE7F]"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-lg bg-[#D9534F]/10 px-3 py-2 text-sm text-[#D9534F]">
          {error}
        </p>
      )}
      {saved && (
        <p className="text-sm text-[#4A7C59]">Profil enregistré.</p>
      )}

      <button
        type="button"
        disabled={updateProfile.isPending}
        onClick={() => void submit()}
        className="w-full rounded-xl bg-[#4A7C59] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {updateProfile.isPending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </div>
  );
}
