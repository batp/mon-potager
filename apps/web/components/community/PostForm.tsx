"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useFeed } from "@/hooks/useCommunity";
import { cn } from "@/lib/utils";

export function PostForm({ onClose }: { onClose: () => void }) {
  const { createPost } = useFeed();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files, ...Array.from(incoming)].slice(0, 4);
    setFiles(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const submit = async () => {
    setError(null);
    try {
      await createPost.mutateAsync({ content, files });
      onClose();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-[#F5F0E8] p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#2D5A3D]">Nouveau post</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#3D3229]/60 hover:bg-white/60"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Partagez une astuce, une photo de récolte…"
          className="w-full resize-none rounded-xl border border-[#E8DFD0] bg-white px-3 py-2 text-sm text-[#3D3229] outline-none focus:border-[#7BAE7F]"
        />
        <p className="mt-1 text-right text-xs text-[#3D3229]/50">
          {content.length}/500
        </p>

        {previews.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {previews.map((src, i) => (
              <div key={src} className="relative">
                <img
                  src={src}
                  alt=""
                  className="h-24 w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-lg bg-[#D9534F]/10 px-3 py-2 text-sm text-[#D9534F]">
            {error}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={files.length >= 4}
            className="flex items-center gap-2 rounded-xl border border-[#E8DFD0] px-3 py-2 text-sm text-[#3D3229]/70 disabled:opacity-40"
          >
            <ImagePlus className="h-4 w-4" />
            Photos ({files.length}/4)
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <button
            type="button"
            disabled={!content.trim() || createPost.isPending}
            onClick={() => void submit()}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold text-white",
              "bg-[#4A7C59] disabled:opacity-50",
            )}
          >
            {createPost.isPending ? "Publication…" : "Publier"}
          </button>
        </div>
      </div>
    </div>
  );
}
