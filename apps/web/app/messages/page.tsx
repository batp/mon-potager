"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ConversationList } from "@/components/messages/ConversationList";
import { useConversations } from "@/hooks/useMessages";

export default function MessagesPage() {
  const { conversations, isLoading } = useConversations();

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Link
          href="/communaute"
          className="rounded-lg p-1 text-[#4A7C59] hover:bg-white/60 md:hidden"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#2D5A3D]">Messages</h1>
          <p className="text-sm text-[#3D3229]/70">Conversations privées</p>
        </div>
      </header>

      <ConversationList conversations={conversations} isLoading={isLoading} />
    </div>
  );
}
