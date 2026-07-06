"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { ReportModal } from "@/components/community/ReportModal";
import type { CommentWithAuthor } from "@/types/community";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CommentList({
  comments,
  currentUserId,
}: {
  comments: CommentWithAuthor[];
  currentUserId?: string;
}) {
  const [reportId, setReportId] = useState<string | null>(null);

  if (comments.length === 0) {
    return (
      <p className="text-sm text-[#3D3229]/50">Aucun commentaire pour l&apos;instant.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {comments.map((comment) => {
        const name = comment.author.username ?? "Jardinier";
        const isOwner = comment.user_id === currentUserId;
        return (
          <li
            key={comment.id}
            className="flex gap-3 rounded-xl bg-white/70 p-3"
          >
            <Avatar name={name} url={comment.author.avatar_url} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#2D5A3D]">{name}</p>
                {!isOwner && (
                  <button
                    type="button"
                    onClick={() => setReportId(comment.id)}
                    className="text-[#3D3229]/40 hover:text-[#3D3229]"
                    aria-label="Signaler"
                  >
                    <Flag className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-[#3D3229]">{comment.content}</p>
              <p className="mt-1 text-xs text-[#3D3229]/40">
                {formatDate(comment.created_at)}
              </p>
            </div>
          </li>
        );
      })}

      {reportId && (
        <ReportModal
          targetType="comment"
          targetId={reportId}
          onClose={() => setReportId(null)}
        />
      )}
    </ul>
  );
}
