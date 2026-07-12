import { MoonStar, SunMedium } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      aria-label="Toggle theme"
      size="icon"
      type="button"
      variant="outline"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunMedium /> : <MoonStar />}
    </Button>
  );
}
