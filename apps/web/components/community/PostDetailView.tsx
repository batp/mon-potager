"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/community/PostCard";
import { CommentList } from "@/components/community/CommentList";
import { useAuth } from "@/components/providers/AuthProvider";
import { useFeed, usePost } from "@/hooks/useCommunity";

export function PostDetailView({ postId }: { postId: string }) {
  const { user } = useAuth();
  const { post, comments, isLoading, error } = usePost(postId);
  const { toggleLike, addComment, deletePost } = useFeed();
  const [comment, setComment] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (isLoading) {
    return <p className="text-sm text-[#3D3229]/60">Chargement…</p>;
  }

  if (error || !post) {
    return (
      <div className="space-y-4">
        <Link href="/communaute" className="inline-flex items-center gap-1 text-sm text-[#4A7C59]">
          <ArrowLeft className="h-4 w-4" />
          Retour au fil
        </Link>
        <p className="text-sm text-[#D9534F]">Post introuvable.</p>
      </div>
    );
  }

  const submitComment = async () => {
    setSubmitError(null);
    try {
      await addComment.mutateAsync({ postId, content: comment });
      setComment("");
    } catch (e) {
      setSubmitError((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/communaute"
        className="inline-flex items-center gap-1 text-sm font-medium text-[#4A7C59]"
      >
        <ArrowLeft className="h-4 w-4" />
        Fil communautaire
      </Link>

      <PostCard
        post={post}
        currentUserId={user?.id}
        liking={toggleLike.isPending}
        onToggleLike={() =>
          void toggleLike.mutate({ postId: post.id, liked: post.liked_by_me })
        }
        onDelete={
          post.user_id === user?.id
            ? () => {
                if (confirm("Supprimer ce post ?")) {
                  void deletePost.mutate(post.id);
                }
              }
            : undefined
        }
      />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#2D5A3D]">Commentaires</h2>
        <CommentList comments={comments} currentUserId={user?.id} />

        <div className="rounded-2xl border border-[#E8DFD0] bg-white/80 p-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="Ajouter un commentaire…"
            className="w-full resize-none bg-transparent text-sm outline-none"
          />
          {submitError && (
            <p className="text-xs text-[#D9534F]">{submitError}</p>
          )}
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              disabled={!comment.trim() || addComment.isPending}
              onClick={() => void submitComment()}
              className="rounded-xl bg-[#4A7C59] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Commenter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
