import { ImagePlus, LayoutGrid, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/utils/cn";

const navigation = [
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

export function Sidebar() {
  return (
    <aside className="sticky top-24 hidden w-64 shrink-0 xl:block">
      <nav className="surface flex flex-col gap-2 p-3">
        {navigation.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground",
                isActive && "bg-secondary text-foreground",
              )
            }
            to={to}
          >
            <Icon className="size-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
