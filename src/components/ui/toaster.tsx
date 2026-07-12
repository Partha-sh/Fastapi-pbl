import { Toaster as Sonner } from "sonner";

import { useTheme } from "@/hooks/use-theme";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      closeButton
      position="top-right"
      richColors
      theme={resolvedTheme}
      toastOptions={{
        className: "rounded-2xl border border-border bg-card text-card-foreground",
      }}
    />
  );
}
