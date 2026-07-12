import { Link } from "react-router-dom";

import logoMark from "@/assets/logo-mark.svg";
import { cn } from "@/utils/cn";

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export function Logo({ compact = false, className }: LogoProps) {
  return (
    <Link
      to="/feed"
      className={cn("inline-flex items-center gap-3 text-foreground", className)}
    >
      <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
        <img alt="PixShare" className="size-6 invert" src={logoMark} />
      </span>
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="text-base font-semibold tracking-[-0.02em]">PixShare</span>
          <span className="text-xs text-muted-foreground">Photo stories, quietly refined</span>
        </span>
      ) : null}
    </Link>
  );
}
