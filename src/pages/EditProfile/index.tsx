import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { queryClient } from "@/api/query-client";
import { ErrorState } from "@/components/common/error-state";
import { SkeletonLoader } from "@/components/common/skeleton-loader";
import { UserAvatar } from "@/components/profile/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useMyProfile } from "@/hooks/use-current-user";
import { updateMyProfile } from "@/services/users.service";
import { getErrorMessage } from "@/utils/format";

const editProfileSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  profile_picture: z.string().trim().optional(),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const profileQuery = useMyProfile();

  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: "",
      profile_picture: "",
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      form.reset({
        username: profileQuery.data.username,
        profile_picture: profileQuery.data.profile_picture ?? "",
      });
    }
  }, [form, profileQuery.data]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!profileQuery.data) {
      return;
    }

    const payload: { username?: string; profile_picture?: string | null } = {};
    const nextUsername = values.username.trim();
    const nextProfilePicture = values.profile_picture?.trim() ?? "";

    if (nextUsername !== profileQuery.data.username) {
      payload.username = nextUsername;
    }

    if (
      nextProfilePicture &&
      nextProfilePicture !== (profileQuery.data.profile_picture ?? "")
    ) {
      payload.profile_picture = nextProfilePicture;
    }

    if (Object.keys(payload).length === 0) {
      if (!nextProfilePicture && profileQuery.data.profile_picture) {
        toast.message(
          "The current API does not support clearing an existing profile photo, so blank values are ignored.",
        );
      } else {
        toast.message("Nothing changed.");
      }
      return;
    }

    try {
      await updateMyProfile(payload);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
      ]);
      refreshSession();
      toast.success("Profile updated.");
      navigate("/profile", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="surface space-y-4 p-6">
          <SkeletonLoader className="h-8 w-44" />
          <SkeletonLoader className="h-4 w-full" />
        </div>
        <div className="surface space-y-4 p-6">
          <SkeletonLoader className="h-11 w-full" />
          <SkeletonLoader className="h-11 w-full" />
          <SkeletonLoader className="h-11 w-36" />
        </div>
      </div>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <ErrorState
        actionLabel="Back to profile"
        description="Your current profile data could not be loaded for editing."
        onAction={() => navigate("/profile")}
        title="Editor unavailable"
      />
    );
  }

  const previewUsername = form.watch("username") || profileQuery.data.username;
  const previewProfilePicture =
    form.watch("profile_picture") || profileQuery.data.profile_picture;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl"
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.35 }}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl tracking-[-0.05em]">Edit profile</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-7">
              Updates are sent to the existing `/users/me` endpoint only. The backend
              currently accepts a username and a hosted profile image URL.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...form.register("username")} />
                {form.formState.errors.username ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile_picture">Profile image URL</Label>
                <Input
                  id="profile_picture"
                  placeholder="https://ik.imagekit.io/your-image.jpg"
                  {...form.register("profile_picture")}
                />
                <p className="text-sm leading-6 text-muted-foreground">
                  The current backend does not expose a dedicated profile photo upload
                  endpoint, so this field accepts an existing hosted image URL instead.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit">Save changes</Button>
                <Button asChild type="button" variant="outline">
                  <Link to="/profile">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <UserAvatar
                className="size-16 border border-border/70"
                profilePicture={previewProfilePicture || undefined}
                username={previewUsername}
              />
              <div>
                <p className="text-lg font-semibold">@{previewUsername}</p>
                <p className="text-sm text-muted-foreground">{profileQuery.data.email}</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Leaving the profile image blank keeps the existing backend value unchanged.
              Clearing an already saved image is not supported by the current API.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
