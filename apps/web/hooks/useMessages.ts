"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { assertOnline } from "@/lib/network";
import type {
  ConversationPreview,
  MessageWithSender,
} from "@/types/message";

function orderedPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

async function fetchConversations(
  userId: string,
): Promise<ConversationPreview[]> {
  const supabase = createClient()!;

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b, updated_at")
    .or(`participant_a.eq.${userId},participant_b.eq.${userId}`)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  if (!conversations?.length) return [];

  const otherIds = conversations.map((c) =>
    c.participant_a === userId ? c.participant_b : c.participant_a,
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .in("id", otherIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const previews: ConversationPreview[] = [];

  for (const conv of conversations) {
    const otherId =
      conv.participant_a === userId ? conv.participant_b : conv.participant_a;

    const { data: lastMessages } = await supabase
      .from("messages")
      .select("content, created_at, sender_id, read_at")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const last = lastMessages?.[0] ?? null;

    const { count: unread } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", conv.id)
      .neq("sender_id", userId)
      .is("read_at", null);

    previews.push({
      id: conv.id,
      other_user: profileMap.get(otherId) ?? {
        id: otherId,
        username: null,
        avatar_url: null,
      },
      last_message: last?.content ?? null,
      last_message_at: last?.created_at ?? null,
      unread_count: unread ?? 0,
    });
  }

  return previews;
}

async function fetchMessages(conversationId: string) {
  const supabase = createClient()!;
  const { data, error } = await supabase
    .from("messages")
    .select(
      "id, conversation_id, sender_id, content, read_at, created_at, sender:profiles!messages_sender_id_fkey(id, username, avatar_url)",
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const sender = Array.isArray(row.sender) ? row.sender[0] : row.sender;
    return {
      id: row.id,
      conversation_id: row.conversation_id,
      sender_id: row.sender_id,
      content: row.content,
      read_at: row.read_at,
      created_at: row.created_at,
      sender: sender ?? {
        id: row.sender_id,
        username: null,
        avatar_url: null,
      },
    } satisfies MessageWithSender;
  });
}

export function useUnreadMessageCount() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["messages", "unread-count", user?.id],
    queryFn: async () => {
      const supabase = createClient()!;

      const { data: convs, error: convError } = await supabase
        .from("conversations")
        .select("id")
        .or(`participant_a.eq.${user!.id},participant_b.eq.${user!.id}`);

      if (convError) throw convError;

      const ids = convs?.map((c) => c.id) ?? [];
      if (ids.length === 0) return 0;

      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .neq("sender_id", user!.id)
        .is("read_at", null)
        .in("conversation_id", ids);

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user,
    refetchInterval: 30_000,
  });
}

export function useConversations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["messages", "conversations", user?.id],
    queryFn: () => fetchConversations(user!.id),
    enabled: !!user,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["messages"] });
  };

  const getOrCreateConversation = useMutation({
    mutationFn: async (otherUserId: string) => {
      assertOnline();
      if (otherUserId === user!.id) {
        throw new Error("Impossible de vous écrire à vous-même");
      }

      const supabase = createClient()!;
      const [participant_a, participant_b] = orderedPair(user!.id, otherUserId);

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
    onSuccess: invalidate,
  });

  return {
    conversations: query.data ?? [],
    isLoading: query.isLoading,
    getOrCreateConversation,
    invalidate,
  };
}

export function useChat(conversationId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [realtimeReady, setRealtimeReady] = useState(false);

  const queryKey = ["messages", "thread", conversationId];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId && !!user,
  });

  const markAsRead = useCallback(async () => {
    if (!user || !conversationId) return;
    const supabase = createClient()!;
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user.id)
      .is("read_at", null);

    queryClient.invalidateQueries({ queryKey: ["messages", "unread-count"] });
    queryClient.invalidateQueries({ queryKey: ["messages", "conversations"] });
  }, [conversationId, queryClient, user]);

  useEffect(() => {
    if (!conversationId || !user) return;

    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async () => {
          await queryClient.invalidateQueries({ queryKey });
          await markAsRead();
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setRealtimeReady(true);
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversationId, markAsRead, queryClient, queryKey, user]);

  useEffect(() => {
    void markAsRead();
  }, [markAsRead, query.data?.length]);

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      assertOnline();
      const trimmed = content.trim();
      if (!trimmed) throw new Error("Message vide");
      if (trimmed.length > 1000) throw new Error("Maximum 1000 caractères");

      const supabase = createClient()!;
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user!.id,
        content: trimmed,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["messages", "conversations"] });
    },
  });

  return {
    messages: query.data ?? [],
    isLoading: query.isLoading,
    realtimeReady,
    sendMessage,
    markAsRead,
  };
}
