"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import type { ConversationPreview } from "@/types/message";

function formatTime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export function ConversationList({
  conversations,
  isLoading,
}: {
  conversations: ConversationPreview[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <p className="text-sm text-[#3D3229]/60">Chargement…</p>;
  }

  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#7BAE7F]/50 bg-white/60 p-8 text-center">
        <MessageCircle className="mx-auto h-10 w-10 text-[#7BAE7F]/60" />
        <p className="mt-3 text-sm text-[#3D3229]/70">
          Aucune conversation. Contactez un jardinier depuis un post.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {conversations.map((conv) => {
        const name = conv.other_user.username ?? "Jardinier";
        return (
          <li key={conv.id}>
            <Link
              href={`/messages/${conv.id}`}
              className="flex items-center gap-3 rounded-2xl border border-[#E8DFD0]/80 bg-white/90 p-4 transition-colors hover:bg-white"
            >
              <Avatar name={name} url={conv.other_user.avatar_url} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-[#2D5A3D]">{name}</p>
                  <span className="text-xs text-[#3D3229]/40">
                    {formatTime(conv.last_message_at)}
                  </span>
                </div>
                <p className="truncate text-sm text-[#3D3229]/60">
                  {conv.last_message ?? "Nouvelle conversation"}
                </p>
              </div>
              {conv.unread_count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E8A838] px-1.5 text-[10px] font-bold text-[#3D3229]">
                  {conv.unread_count > 9 ? "9+" : conv.unread_count}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
