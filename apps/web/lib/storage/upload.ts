import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/images/compress";

function publicUrl(bucket: string, path: string) {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase non configuré");
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadPostImages(userId: string, files: File[]) {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase non configuré");
  if (files.length > 4) throw new Error("Maximum 4 photos par post");

  const urls: string[] = [];

  for (const file of files) {
    const blob = await compressImage(file);
    const path = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
    const { error } = await supabase.storage.from("posts").upload(path, blob, {
      contentType: "image/jpeg",
      upsert: false,
    });
    if (error) throw error;
    urls.push(publicUrl("posts", path));
  }

  return urls;
}

export async function uploadAvatar(userId: string, file: File) {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase non configuré");

  const blob = await compressImage(file);
  const path = `${userId}/avatar.jpg`;
  const { error } = await supabase.storage.from("avatars").upload(path, blob, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) throw error;
  return `${publicUrl("avatars", path)}?t=${Date.now()}`;
}
