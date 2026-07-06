"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { assertOnline } from "@/lib/network";

function orderedPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export function MessageAuthorButton({
  userId,
  className,
}: {
  userId: string;
  className?: string;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const startChat = useMutation({
    mutationFn: async (otherUserId: string) => {
      assertOnline();
      if (!user) throw new Error("Non connecté");
      if (otherUserId === user.id) {
        throw new Error("Impossible de vous écrire à vous-même");
      }

      const supabase = createClient()!;
      const [participant_a, participant_b] = orderedPair(user.id, otherUserId);

      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("participant_a", participant_a)
        .eq("participant_b", participant_b)
        .maybeSingle();

      if (existing) return existing.id;

      const { data, error } = await supabase
        .from("conversations")
        .insert({ participant_a, participant_b })
        .select("id")
        .single();

      if (error) throw error;
      return data.id as string;
    },
    onSuccess: (conversationId) => {
      router.push(`/messages/${conversationId}`);
    },
  });

  return (
    <button
      type="button"
      disabled={startChat.isPending}
      onClick={() => void startChat.mutate(userId)}
      className={className}
      aria-label="Envoyer un message"
    >
      <MessageSquare className="h-4 w-4" />
    </button>
  );
}
