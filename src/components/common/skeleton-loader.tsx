import { cn } from "@/utils/cn";

type SkeletonLoaderProps = {
  className?: string;
};

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
  return <div className={cn("animate-pulse rounded-2xl bg-secondary/80", className)} />;
}
