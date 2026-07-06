"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { assertOnline } from "@/lib/network";
import { uploadPostImages } from "@/lib/storage/upload";
import type {
  CommentWithAuthor,
  PostWithAuthor,
  ReportTargetType,
} from "@/types/community";

const PAGE_SIZE = 20;

async function fetchPostsPage(userId: string, page: number) {
  const supabase = createClient()!;
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      "id, user_id, content, images, likes_count, created_at, author:profiles!posts_user_id_fkey(id, username, avatar_url, city)",
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  if (!posts?.length) return [];

  const postIds = posts.map((p) => p.id);

  const [{ data: likes }, { data: commentRows }] = await Promise.all([
    supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", userId)
      .in("post_id", postIds),
    supabase.from("comments").select("post_id").in("post_id", postIds),
  ]);

  const likedSet = new Set((likes ?? []).map((l) => l.post_id));
  const commentCounts = new Map<string, number>();
  for (const row of commentRows ?? []) {
    commentCounts.set(row.post_id, (commentCounts.get(row.post_id) ?? 0) + 1);
  }

  return posts.map((post) => {
    const author = Array.isArray(post.author) ? post.author[0] : post.author;
    return {
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      images: post.images ?? [],
      likes_count: post.likes_count,
      created_at: post.created_at,
      author: author ?? {
        id: post.user_id,
        username: null,
        avatar_url: null,
        city: null,
      },
      liked_by_me: likedSet.has(post.id),
      comments_count: commentCounts.get(post.id) ?? 0,
    } satisfies PostWithAuthor;
  });
}

async function fetchPostDetail(postId: string, userId: string) {
  const supabase = createClient()!;

  const { data: post, error } = await supabase
    .from("posts")
    .select(
      "id, user_id, content, images, likes_count, created_at, author:profiles!posts_user_id_fkey(id, username, avatar_url, city)",
    )
    .eq("id", postId)
    .single();

  if (error) throw error;

  const [{ data: like }, { count }] = await Promise.all([
    supabase
      .from("post_likes")
      .select("post_id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId),
  ]);

  const author = Array.isArray(post.author) ? post.author[0] : post.author;

  return {
    id: post.id,
    user_id: post.user_id,
    content: post.content,
    images: post.images ?? [],
    likes_count: post.likes_count,
    created_at: post.created_at,
    author: author ?? {
      id: post.user_id,
      username: null,
      avatar_url: null,
      city: null,
    },
    liked_by_me: !!like,
    comments_count: count ?? 0,
  } satisfies PostWithAuthor;
}

async function fetchComments(postId: string) {
  const supabase = createClient()!;
  const { data, error } = await supabase
    .from("comments")
    .select(
      "id, post_id, user_id, content, created_at, author:profiles!comments_user_id_fkey(id, username, avatar_url)",
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const author = Array.isArray(row.author) ? row.author[0] : row.author;
    return {
      id: row.id,
      post_id: row.post_id,
      user_id: row.user_id,
      content: row.content,
      created_at: row.created_at,
      author: author ?? {
        id: row.user_id,
        username: null,
        avatar_url: null,
      },
    } satisfies CommentWithAuthor;
  });
}

export function useFeed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ["community", "feed", user?.id],
    queryFn: ({ pageParam }) => fetchPostsPage(user!.id, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, pageParam) =>
      lastPage.length < PAGE_SIZE ? undefined : pageParam + 1,
    enabled: !!user,
  });

  const posts = query.data?.pages.flat() ?? [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["community"] });
  };

  const createPost = useMutation({
    mutationFn: async ({
      content,
      files,
    }: {
      content: string;
      files?: File[];
    }) => {
      assertOnline();
      const trimmed = content.trim();
      if (!trimmed) throw new Error("Le texte du post est requis");
      if (trimmed.length > 500) throw new Error("Maximum 500 caractères");

      const supabase = createClient()!;
      const images = files?.length
        ? await uploadPostImages(user!.id, files)
        : [];

      const { error } = await supabase.from("posts").insert({
        user_id: user!.id,
        content: trimmed,
        images,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const toggleLike = useMutation({
    mutationFn: async ({
      postId,
      liked,
    }: {
      postId: string;
      liked: boolean;
    }) => {
      assertOnline();
      const supabase = createClient()!;
      if (liked) {
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("post_likes").insert({
          post_id: postId,
          user_id: user!.id,
        });
        if (error) throw error;
      }
    },
    onMutate: async ({ postId, liked }) => {
      await queryClient.cancelQueries({ queryKey: ["community", "feed"] });
      const delta = liked ? -1 : 1;

      queryClient.setQueriesData<{
        pages: PostWithAuthor[][];
        pageParams: number[];
      }>({ queryKey: ["community", "feed"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    liked_by_me: !liked,
                    likes_count: Math.max(0, post.likes_count + delta),
                  }
                : post,
            ),
          ),
        };
      });
    },
    onSettled: invalidate,
  });

  const addComment = useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }) => {
      assertOnline();
      const trimmed = content.trim();
      if (!trimmed) throw new Error("Commentaire vide");
      if (trimmed.length > 300) throw new Error("Maximum 300 caractères");

      const supabase = createClient()!;
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: user!.id,
        content: trimmed,
      });
      if (error) throw error;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["community", "comments", vars.postId],
      });
      invalidate();
    },
  });

  const reportContent = useMutation({
    mutationFn: async ({
      targetType,
      targetId,
      reason,
    }: {
      targetType: ReportTargetType;
      targetId: string;
      reason: string;
    }) => {
      assertOnline();
      const supabase = createClient()!;
      const { error } = await supabase.from("reports").insert({
        reporter_id: user!.id,
        target_type: targetType,
        target_id: targetId,
        reason,
      });
      if (error) throw error;
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      assertOnline();
      const supabase = createClient()!;
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    posts,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    createPost,
    toggleLike,
    addComment,
    reportContent,
    deletePost,
  };
}

export function usePost(postId: string) {
  const { user } = useAuth();

  const postQuery = useQuery({
    queryKey: ["community", "post", postId, user?.id],
    queryFn: () => fetchPostDetail(postId, user!.id),
    enabled: !!user && !!postId,
  });

  const commentsQuery = useQuery({
    queryKey: ["community", "comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  });

  return {
    post: postQuery.data,
    comments: commentsQuery.data ?? [],
    isLoading: postQuery.isLoading || commentsQuery.isLoading,
    error: postQuery.error,
  };
}
