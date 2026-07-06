"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageSquare, Plus } from "lucide-react";
import { PostCard } from "@/components/community/PostCard";
import { PostForm } from "@/components/community/PostForm";
import { useAuth } from "@/components/providers/AuthProvider";
import { useFeed } from "@/hooks/useCommunity";
import { NavMessageBadge } from "@/components/shared/NavMessageBadge";

export function CommunityFeed() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    posts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    toggleLike,
    deletePost,
  } = useFeed();

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void fetchNextPage();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D5A3D]">Communauté</h1>
          <p className="text-sm text-[#3D3229]/70">Fil d&apos;actualité des jardiniers</p>
        </div>
        <Link
          href="/messages"
          className="relative flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[#E8DFD0] bg-white/80 text-[#4A7C59]"
          aria-label="Messages"
        >
          <MessageSquare className="h-5 w-5" />
          <NavMessageBadge className="absolute -top-1 -right-1" />
        </Link>
      </header>

      <div className="rounded-2xl border border-[#7BAE7F]/40 bg-white/80 p-4">
        <p className="text-sm font-semibold text-[#2D5A3D]">Conseil du jour</p>
        <p className="mt-1 text-sm text-[#3D3229]/80">
          Associez basilic et tomates pour éloigner certains nuisibles.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-[#D4A574]/60 bg-[#F5F0E8]/50 px-4 py-2 text-center text-xs text-[#3D3229]/50">
        Groupes — bientôt disponible
      </div>

      {isLoading ? (
        <p className="text-sm text-[#3D3229]/60">Chargement du fil…</p>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#7BAE7F]/50 bg-white/60 p-8 text-center">
          <p className="text-sm text-[#3D3229]/70">
            Aucun post pour l&apos;instant. Soyez le premier à partager !
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user?.id}
              liking={toggleLike.isPending}
              onToggleLike={() =>
                void toggleLike.mutate({
                  postId: post.id,
                  liked: post.liked_by_me,
                })
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
          ))}
          <div ref={loadMoreRef} className="h-4" />
          {isFetchingNextPage && (
            <p className="text-center text-xs text-[#3D3229]/50">Chargement…</p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#4A7C59] text-white shadow-lg md:bottom-8"
        aria-label="Nouveau post"
      >
        <Plus className="h-6 w-6" />
      </button>

      {showForm && <PostForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
