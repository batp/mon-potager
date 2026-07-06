import type { Profile } from "@/types/profile";

export interface Conversation {
  id: string;
  participant_a: string;
  participant_b: string;
  updated_at: string;
}

export interface ConversationPreview {
  id: string;
  other_user: Pick<Profile, "id" | "username" | "avatar_url">;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface MessageWithSender extends Message {
  sender: Pick<Profile, "id" | "username" | "avatar_url">;
}
