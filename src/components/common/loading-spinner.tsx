import { LoaderCircle } from "lucide-react";

import { cn } from "@/utils/cn";

type LoadingSpinnerProps = {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
};

export function LoadingSpinner({
  className,
  label = "Loading",
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 text-muted-foreground", className)}>
      <LoaderCircle className={cn("animate-spin", sizes[size])} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
