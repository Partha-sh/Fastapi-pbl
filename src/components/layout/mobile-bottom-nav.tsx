import { ImagePlus, LayoutGrid, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/utils/cn";

const items = [
  {
    label: "Feed",
    to: "/feed",
    icon: LayoutGrid,
  },
  {
    label: "Create",
    to: "/create",
    icon: ImagePlus,
  },
  {
    label: "Profile",
    to: "/profile",
    icon: UserRound,
  },
];

export function MobileBottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 px-4 xl:hidden">
      <div className="mx-auto flex max-w-sm items-center justify-around rounded-full border border-border/80 bg-card/95 px-3 py-2 shadow-soft backdrop-blur-xl">
        {items.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            className={({ isActive }) =>
              cn(
                "flex min-w-[84px] flex-col items-center gap-1 rounded-full px-4 py-2 text-[11px] font-medium text-muted-foreground transition-colors",
                isActive && "bg-secondary text-foreground",
              )
            }
            to={to}
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
