"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatView } from "@/components/messages/ChatView";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const conversationId = params.id;
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState<{
    username: string | null;
    avatar_url: string | null;
  } | null>(null);

  useEffect(() => {
    if (!user || !conversationId) return;

    const load = async () => {
      const supabase = createClient();
      if (!supabase) return;

      const { data: conv } = await supabase
        .from("conversations")
        .select("participant_a, participant_b")
        .eq("id", conversationId)
        .single();

      if (!conv) return;

      const otherId =
        conv.participant_a === user.id ? conv.participant_b : conv.participant_a;

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", otherId)
        .single();

      setOtherUser(
        profile ?? { username: null, avatar_url: null },
      );
    };

    void load();
  }, [conversationId, user]);

  if (!otherUser) {
    return <p className="text-sm text-[#3D3229]/60">Chargement…</p>;
  }

  return (
    <ChatView conversationId={conversationId} otherUser={otherUser} />
  );
}
