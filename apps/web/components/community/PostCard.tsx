"use client";

import { useState } from "react";
import { Flag, Heart, MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/shared/Avatar";
import { ReportModal } from "@/components/community/ReportModal";
import { MessageAuthorButton } from "@/components/messages/MessageAuthorButton";
import { cn } from "@/lib/utils";
import type { PostWithAuthor } from "@/types/community";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PostCard({
  post,
  currentUserId,
  onToggleLike,
  onDelete,
  liking,
}: {
  post: PostWithAuthor;
  currentUserId?: string;
  onToggleLike: () => void;
  onDelete?: () => void;
  liking?: boolean;
}) {
  const [showReport, setShowReport] = useState(false);
  const displayName = post.author.username ?? "Jardinier";
  const isOwner = currentUserId === post.user_id;

  return (
    <>
      <article className="rounded-2xl border border-[#7BAE7F]/30 bg-white/90 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Avatar name={displayName} url={post.author.avatar_url} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[#2D5A3D]">{displayName}</p>
                <p className="text-xs text-[#3D3229]/50">
                  {formatDate(post.created_at)}
                  {post.author.city ? ` · ${post.author.city}` : ""}
                </p>
              </div>
              {!isOwner && (
                <div className="flex items-center gap-1">
                  <MessageAuthorButton
                    userId={post.user_id}
                    className="rounded-lg p-1.5 text-[#3D3229]/40 hover:bg-[#F5F0E8] hover:text-[#4A7C59]"
                  />
                  <button
                  type="button"
                  onClick={() => setShowReport(true)}
                  className="rounded-lg p-1.5 text-[#3D3229]/40 hover:bg-[#F5F0E8] hover:text-[#3D3229]"
                  aria-label="Signaler"
                >
                  <Flag className="h-4 w-4" />
                </button>
                </div>
              )}
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm text-[#3D3229]">
              {post.content}
            </p>

            {post.images.length > 0 && (
              <div
                className={cn(
                  "mt-3 grid gap-2",
                  post.images.length === 1 ? "grid-cols-1" : "grid-cols-2",
                )}
              >
                {post.images.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="max-h-48 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                disabled={liking}
                onClick={onToggleLike}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium transition-colors",
                  post.liked_by_me
                    ? "text-[#D9534F]"
                    : "text-[#3D3229]/60 hover:text-[#D9534F]",
                )}
              >
                <Heart
                  className={cn("h-4 w-4", post.liked_by_me && "fill-current")}
                />
                {post.likes_count}
              </button>

              <Link
                href={`/communaute/${post.id}`}
                className="flex items-center gap-1.5 text-sm font-medium text-[#3D3229]/60 hover:text-[#4A7C59]"
              >
                <MessageCircle className="h-4 w-4" />
                {post.comments_count}
              </Link>

              {isOwner && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="ml-auto flex items-center gap-1 text-xs text-[#D9534F]/70 hover:text-[#D9534F]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      {showReport && (
        <ReportModal
          targetType="post"
          targetId={post.id}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
}
