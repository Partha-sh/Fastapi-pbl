import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { UserAvatar } from "@/components/profile/user-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FeedPost } from "@/types/post";
import { formatRelativeTime } from "@/utils/format";

type PostCardProps = {
  post: FeedPost;
  currentUsername?: string | null;
  onDelete?: (postId: string) => void | Promise<void>;
};

export function PostCard({
  post,
  currentUsername,
  onDelete,
}: PostCardProps) {
  const isOwner = currentUsername === post.username;
  const profileLink = isOwner ? "/profile" : `/profile/${post.username}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
          <Link className="flex min-w-0 items-center gap-3" to={profileLink}>
            <UserAvatar
              className="size-11 border border-border/70"
              profilePicture={post.profile_picture}
              username={post.username}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">@{post.username}</p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(post.created_at)}
              </p>
            </div>
          </Link>
          {isOwner && onDelete ? (
            <ConfirmationDialog
              confirmLabel="Delete"
              description="This uses the existing delete post endpoint and cannot be undone."
              title="Delete this post?"
              trigger={
                <Button size="icon" type="button" variant="ghost">
                  <Trash2 />
                </Button>
              }
              onConfirm={() => onDelete(post.id)}
            />
          ) : null}
        </div>
        <div className="aspect-[4/3] w-full bg-secondary/40">
          <img
            alt={post.caption}
            className="h-full w-full object-cover"
            loading="lazy"
            src={post.image_url}
          />
        </div>
        <CardContent className="space-y-3 p-5">
          <p className="text-sm leading-7 text-foreground/90">{post.caption}</p>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Live from the existing PixShare REST feed
          </p>
        </CardContent>
      </Card>
    </motion.article>
  );
}
