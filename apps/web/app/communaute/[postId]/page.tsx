import { PostDetailView } from "@/components/community/PostDetailView";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  return <PostDetailView postId={postId} />;
}
