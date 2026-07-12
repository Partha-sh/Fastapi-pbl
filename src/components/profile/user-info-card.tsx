import type { ReactNode } from "react";

import { Camera, Mail, Sparkles } from "lucide-react";

import { UserAvatar } from "@/components/profile/user-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UserInfoCardProps = {
  username: string;
  profilePicture?: string | null;
  totalPosts: number;
  email?: string;
  action?: ReactNode;
  isOwnProfile?: boolean;
};

export function UserInfoCard({
  username,
  profilePicture,
  totalPosts,
  email,
  action,
  isOwnProfile = false,
}: UserInfoCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar
            className="size-16 border border-border/80"
            profilePicture={profilePicture}
            username={username}
          />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl tracking-[-0.03em]">
                @{username}
              </CardTitle>
              <Badge variant="outline">
                <Sparkles className="mr-1 size-3.5" />
                PixShare
              </Badge>
            </div>
            <CardDescription className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2">
                <Camera className="size-4" />
                {totalPosts} post{totalPosts === 1 ? "" : "s"}
              </span>
              {email ? (
                <span className="inline-flex items-center gap-2">
                  <Mail className="size-4" />
                  {email}
                </span>
              ) : null}
            </CardDescription>
          </div>
        </div>
        {action}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {isOwnProfile
            ? "Your profile is connected directly to the existing FastAPI user endpoints. Update your username or hosted profile image URL without touching the backend."
            : "This profile is rendered entirely from the live backend response. If the API does not expose additional fields yet, the interface keeps the presentation intentionally minimal."}
        </p>
      </CardContent>
    </Card>
  );
}
