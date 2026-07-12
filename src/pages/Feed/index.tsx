import { useMemo } from "react";
import { motion } from "framer-motion";
import { ImagePlus, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { PostCard } from "@/components/post/post-card";
import { UserInfoCard } from "@/components/profile/user-info-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useMyProfile } from "@/hooks/use-current-user";
import { useDeletePostMutation, useFeedPosts } from "@/hooks/use-posts";
import { getErrorMessage } from "@/utils/format";

function FeedSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="surface overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border/70 px-5 py-4">
            <SkeletonLoader className="size-11 rounded-full" />
            <div className="space-y-2">
              <SkeletonLoader className="h-4 w-28" />
              <SkeletonLoader className="h-3 w-20" />
            </div>
          </div>
          <SkeletonLoader className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-5">
            <SkeletonLoader className="h-4 w-11/12" />
            <SkeletonLoader className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FeedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const profileQuery = useMyProfile();
  const feedQuery = useFeedPosts();
  const deleteMutation = useDeletePostMutation();

  const posts = useMemo(
    () => feedQuery.data?.pages.flatMap((page) => page) ?? [],
    [feedQuery.data],
  );

  const handleDelete = async (postId: string) => {
    try {
      await deleteMutation.mutateAsync(postId);
      toast.success("Post deleted.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="surface p-6"
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Live feed
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.05em]">
                Recent posts from your PixShare backend
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                This feed is backed directly by the existing paginated `/posts`
                endpoint, with JWT attached automatically for protected actions.
              </p>
            </div>
            <Button asChild>
              <Link to="/create">
                <ImagePlus />
                New post
              </Link>
            </Button>
          </div>
        </motion.section>

        {feedQuery.isLoading ? <FeedSkeleton /> : null}

        {feedQuery.isError ? (
          <ErrorState
            actionLabel="Try again"
            description="The feed could not be loaded from the live API right now."
            onAction={() => feedQuery.refetch()}
          />
        ) : null}

        {!feedQuery.isLoading && !feedQuery.isError && posts.length === 0 ? (
          <EmptyState
            actionLabel="Create your first post"
            description="No posts have been returned yet. Publish something with the existing create post endpoint to bring the feed to life."
            icon={ImagePlus}
            onAction={() => navigate("/create")}
            title="Your feed is still empty"
          />
        ) : null}

        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              currentUsername={user?.username}
              post={post}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {feedQuery.hasNextPage && !feedQuery.isLoading ? (
          <div className="flex justify-center">
            <Button
              disabled={feedQuery.isFetchingNextPage}
              type="button"
              variant="outline"
              onClick={() => feedQuery.fetchNextPage()}
            >
              {feedQuery.isFetchingNextPage ? "Loading more..." : "Load more"}
            </Button>
          </div>
        ) : null}
      </div>

      <aside className="hidden space-y-6 xl:block">
        {profileQuery.data ? (
          <UserInfoCard
            email={profileQuery.data.email}
            isOwnProfile
            profilePicture={profileQuery.data.profile_picture}
            totalPosts={profileQuery.data.total_posts}
            username={profileQuery.data.username}
          />
        ) : (
          <div className="surface space-y-4 p-6">
            <SkeletonLoader className="h-5 w-32" />
            <SkeletonLoader className="h-4 w-full" />
            <SkeletonLoader className="h-4 w-3/4" />
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RefreshCw className="size-4" />
              API-aware experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              The backend does not expose likes, comments, or user-specific post routes,
              so the UI keeps the experience elegant without fabricating unsupported
              features.
            </p>
            <p>
              When an API capability is missing, the frontend prefers clarity over fake
              controls or placeholder data.
            </p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
