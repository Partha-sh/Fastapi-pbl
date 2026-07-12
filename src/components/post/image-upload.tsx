import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type ImageUploadProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
};

export function ImageUpload({ file, onFileChange, error }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const helperText = useMemo(() => {
    if (file) {
      const sizeInMb = (file.size / 1024 / 1024).toFixed(1);
      return `${file.name} • ${sizeInMb} MB`;
    }

    return "PNG, JPG, or WEBP. Your backend uploads the selected file directly through the existing /posts endpoint.";
  }, [file]);

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "group relative flex min-h-[320px] w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-dashed border-border bg-secondary/40 p-6 text-center transition-colors hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          error && "border-destructive/50",
        )}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {previewUrl ? (
          <>
            <img
              alt="Selected preview"
              className="absolute inset-0 h-full w-full object-cover"
              src={previewUrl}
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-5 py-4 text-left text-white">
              <div>
                <p className="text-sm font-semibold">Ready to publish</p>
                <p className="text-xs text-white/80">{helperText}</p>
              </div>
              <Button
                className="rounded-full bg-white/15 text-white hover:bg-white/20"
                size="icon"
                type="button"
                variant="ghost"
                onClick={(event) => {
                  event.stopPropagation();
                  onFileChange(null);
                }}
              >
                <X />
              </Button>
            </div>
          </>
        ) : (
          <div className="max-w-sm space-y-4">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-background text-foreground shadow-soft">
              <ImagePlus className="size-7" />
            </span>
            <div className="space-y-2">
              <p className="text-base font-semibold tracking-[-0.02em]">
                Drop an image or click to browse
              </p>
              <p className="text-sm leading-6 text-muted-foreground">{helperText}</p>
            </div>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        accept="image/*"
        className="hidden"
        type="file"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
