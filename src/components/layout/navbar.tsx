import { Link } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";

import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { UserAvatar } from "@/components/profile/user-avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Logo compact className="sm:hidden" />
        <Logo className="hidden sm:inline-flex" />
        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild className="hidden sm:inline-flex" size="sm">
            <Link to="/create">
              <Plus />
              Create post
            </Link>
          </Button>
          <ThemeToggle />
          <Link
            aria-label="Open profile"
            className="rounded-full transition-transform hover:scale-[1.02]"
            to="/profile"
          >
            <UserAvatar
              className="size-11 border border-border/70"
              profilePicture={user?.profile_picture}
              username={user?.username ?? "User"}
            />
          </Link>
          <Button
            aria-label="Logout"
            size="icon"
            type="button"
            variant="ghost"
            onClick={logout}
          >
            <LogOut />
          </Button>
        </div>
      </div>
    </header>
  );
}
