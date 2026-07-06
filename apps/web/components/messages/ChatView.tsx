"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useChat } from "@/hooks/useMessages";
import { cn } from "@/lib/utils";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatView({
  conversationId,
  otherUser,
}: {
  conversationId: string;
  otherUser: { username: string | null; avatar_url: string | null };
}) {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useChat(conversationId);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const displayName = otherUser.username ?? "Jardinier";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const submit = async () => {
    setError(null);
    try {
      await sendMessage.mutateAsync(draft);
      setDraft("");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col">
      <header className="mb-4 flex items-center gap-3 border-b border-[#E8DFD0] pb-3">
        <Link
          href="/messages"
          className="rounded-lg p-1 text-[#4A7C59] hover:bg-white/60"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Avatar name={displayName} url={otherUser.avatar_url} size="sm" />
        <p className="font-semibold text-[#2D5A3D]">{displayName}</p>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {isLoading ? (
          <p className="text-sm text-[#3D3229]/60">Chargement…</p>
        ) : (
          messages.map((msg) => {
            const mine = msg.sender_id === user?.id;
            return (
              <div
                key={msg.id}
                className={cn("flex", mine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    mine
                      ? "bg-[#4A7C59] text-white"
                      : "bg-white/90 text-[#3D3229]",
                  )}
                >
                  <p>{msg.content}</p>
                  <p
                    className={cn(
                      "mt-1 text-[10px]",
                      mine ? "text-white/70" : "text-[#3D3229]/40",
                    )}
                  >
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {error && <p className="mb-2 text-xs text-[#D9534F]">{error}</p>}

      <form
        className="flex gap-2 border-t border-[#E8DFD0] pt-3"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={1000}
          placeholder="Votre message…"
          className="flex-1 rounded-xl border border-[#E8DFD0] bg-white px-3 py-2 text-sm outline-none focus:border-[#7BAE7F]"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sendMessage.isPending}
          className="rounded-xl bg-[#4A7C59] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
