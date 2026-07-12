import { useMemo } from "react";
import { motion } from "framer-motion";
import { ImageOff, PencilLine } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { PostCard } from "@/components/post/post-card";
import { UserInfoCard } from "@/components/profile/user-info-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useMyProfile, usePublicProfile } from "@/hooks/use-current-user";
import { useUserPosts } from "@/hooks/use-posts";

function ProfileHeaderSkeleton() {
  return (
    <div className="surface space-y-5 p-6">
      <div className="flex items-center gap-4">
        <SkeletonLoader className="size-16 rounded-full" />
        <div className="space-y-3">
          <SkeletonLoader className="h-6 w-44" />
          <SkeletonLoader className="h-4 w-56" />
        </div>
      </div>
      <SkeletonLoader className="h-4 w-full" />
    </div>
  );
}

export default function ProfilePage() {
  const { username: routeUsername } = useParams();
  const { user } = useAuth();

  const isOwnProfile =
    !routeUsername || (user?.username ? routeUsername === user.username : false);

  const myProfileQuery = useMyProfile();
  const publicProfileQuery = usePublicProfile(
    routeUsername ?? "",
    Boolean(routeUsername) && !isOwnProfile,
  );

  const profile = isOwnProfile ? myProfileQuery.data : publicProfileQuery.data;
  const profileError = isOwnProfile ? myProfileQuery.error : publicProfileQuery.error;
  const profileLoading = isOwnProfile
    ? myProfileQuery.isLoading
    : publicProfileQuery.isLoading;

  const username = profile?.username ?? user?.username ?? "";
  const expectedPostCount = profile?.total_posts ?? 0;
  const userPostsQuery = useUserPosts(username, expectedPostCount);

  const posts = useMemo(() => userPostsQuery.data ?? [], [userPostsQuery.data]);

  if (profileLoading) {
    return <ProfileHeaderSkeleton />;
  }

  if (profileError) {
    return (
      <ErrorState
        actionLabel="Try again"
        description="The requested profile could not be loaded from the backend."
        onAction={() =>
          isOwnProfile ? myProfileQuery.refetch() : publicProfileQuery.refetch()
        }
      />
    );
  }

  if (!profile) {
    return (
      <EmptyState
        description="No profile data was returned for this route."
        icon={ImageOff}
        title="Profile unavailable"
      />
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.35 }}
    >
      <UserInfoCard
        action={
          isOwnProfile ? (
            <Button asChild variant="outline">
              <Link to="/profile/edit">
                <PencilLine />
                Edit profile
              </Link>
            </Button>
          ) : null
        }
        email={isOwnProfile ? myProfileQuery.data?.email : undefined}
        isOwnProfile={isOwnProfile}
        profilePicture={profile.profile_picture}
        totalPosts={profile.total_posts}
        username={profile.username}
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.03em]">Posts</h2>
            <p className="text-sm text-muted-foreground">
              Rendered by combining the profile response with the existing paginated feed
              endpoint.
            </p>
          </div>
        </div>

        {userPostsQuery.isLoading ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="surface overflow-hidden">
                <SkeletonLoader className="h-16 rounded-none" />
                <SkeletonLoader className="aspect-[4/3] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <SkeletonLoader className="h-4 w-full" />
                  <SkeletonLoader className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {userPostsQuery.isError ? (
          <ErrorState
            actionLabel="Retry"
            description="The profile details loaded, but post aggregation from the feed failed."
            onAction={() => userPostsQuery.refetch()}
            title="Posts could not be assembled"
          />
        ) : null}

        {!userPostsQuery.isLoading && !userPostsQuery.isError && posts.length === 0 ? (
          <EmptyState
            description={
              profile.total_posts > 0
                ? "The backend reports posts for this user, but none were reachable through the paginated feed yet."
                : "No posts have been published for this profile yet."
            }
            icon={ImageOff}
            title="Nothing to show yet"
          />
        ) : null}

        <div className="grid gap-5 lg:grid-cols-2">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              currentUsername={user?.username}
              post={post}
            />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
