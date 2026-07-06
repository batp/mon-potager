"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { assertOnline } from "@/lib/network";
import { uploadAvatar } from "@/lib/storage/upload";

export interface ProfileUpdates {
  username?: string;
  bio?: string | null;
  city?: string | null;
  region?: string | null;
  avatarFile?: File | null;
}

export function useProfileUpdate() {
  const { user, refreshProfile } = useAuth();

  return useMutation({
    mutationFn: async (updates: ProfileUpdates) => {
      assertOnline();
      if (!user) throw new Error("Non connecté");

      const supabase = createClient()!;
      const payload: Record<string, string | null> = {};

      if (updates.username !== undefined) {
        const username = updates.username.trim();
        if (username.length < 2) throw new Error("Pseudo : 2 caractères minimum");
        if (username.length > 30) throw new Error("Pseudo : 30 caractères maximum");
        payload.username = username;
      }

      if (updates.bio !== undefined) {
        const bio = updates.bio?.trim() || null;
        if (bio && bio.length > 280) throw new Error("Bio : 280 caractères maximum");
        payload.bio = bio;
      }

      if (updates.city !== undefined) {
        payload.city = updates.city?.trim() || null;
      }

      if (updates.region !== undefined) {
        payload.region = updates.region?.trim() || null;
      }

      if (updates.avatarFile) {
        payload.avatar_url = await uploadAvatar(user.id, updates.avatarFile);
      }

      if (Object.keys(payload).length === 0) return;

      const { error } = await supabase
        .from("profiles")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) {
        if (error.code === "23505") {
          throw new Error("Ce pseudo est déjà pris");
        }
        throw error;
      }
    },
    onSuccess: async () => {
      await refreshProfile();
    },
  });
}
