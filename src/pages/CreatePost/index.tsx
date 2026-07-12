import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { ErrorState } from "@/components/common/error-state";
import { ImageUpload } from "@/components/post/image-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePostMutation } from "@/hooks/use-posts";
import { getErrorMessage } from "@/utils/format";

const createPostSchema = z.object({
  caption: z.string().trim().min(1, "Caption is required."),
  image: z.custom<File>((value) => value instanceof File, "Select an image to upload."),
});

type CreatePostValues = z.infer<typeof createPostSchema>;

export default function CreatePostPage() {
  const navigate = useNavigate();
  const createPostMutation = useCreatePostMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CreatePostValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      caption: "",
      image: undefined,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setSubmitError(null);
      await createPostMutation.mutateAsync(values);
      toast.success("Post published.");
      navigate("/feed", { replace: true });
    } catch (error) {
      const message = getErrorMessage(error);
      setSubmitError(message);
      toast.error(message);
    }
  });

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-5xl"
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.35 }}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl tracking-[-0.05em]">Create a post</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-7">
              Publishing uses the existing multipart `/posts` endpoint exactly as your
              FastAPI backend expects it: one caption and one uploaded image file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Controller
                control={form.control}
                name="image"
                render={({ field }) => (
                  <ImageUpload
                    error={form.formState.errors.image?.message}
                    file={field.value ?? null}
                    onFileChange={field.onChange}
                  />
                )}
              />
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  maxLength={400}
                  placeholder="Write a thoughtful caption for your image."
                  {...form.register("caption")}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {form.formState.errors.caption?.message ?? "Keep it concise and intentional."}
                  </span>
                  <span>{form.watch("caption").length}/400</span>
                </div>
              </div>
              {submitError ? (
                <ErrorState description={submitError} title="Post could not be created" />
              ) : null}
              <div className="flex justify-end">
                <Button disabled={createPostMutation.isPending} type="submit">
                  {createPostMutation.isPending ? "Publishing..." : "Publish post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Backend-aware notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>The current API accepts image uploads for posts, not profile photos.</p>
            <p>
              This page stays focused on the publish flow instead of pretending extra
              upload endpoints exist.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
