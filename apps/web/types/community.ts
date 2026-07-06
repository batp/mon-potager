import type { Profile } from "@/types/profile";

export interface Post {
  id: string;
  user_id: string;
  content: string;
  images: string[];
  likes_count: number;
  created_at: string;
}

export interface PostWithAuthor extends Post {
  author: Pick<Profile, "id" | "username" | "avatar_url" | "city">;
  liked_by_me: boolean;
  comments_count: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface CommentWithAuthor extends Comment {
  author: Pick<Profile, "id" | "username" | "avatar_url">;
}

export type ReportTargetType = "post" | "comment" | "user";

export interface NewPost {
  content: string;
  images?: string[];
}

export const REPORT_REASONS = [
  "Spam ou publicité",
  "Contenu offensant",
  "Harcèlement",
  "Informations trompeuses",
  "Autre",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];
