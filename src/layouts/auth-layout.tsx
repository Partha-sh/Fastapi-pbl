import { Outlet } from "react-router-dom";
import { LockKeyhole, PanelsTopLeft, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: PanelsTopLeft,
    title: "Premium interface",
    description: "Clean typography, intentional spacing, and a calm visual rhythm.",
  },
  {
    icon: LockKeyhole,
    title: "Live JWT auth",
    description: "Forms connect to your existing FastAPI authentication routes only.",
  },
  {
    icon: Sparkles,
    title: "No backend changes",
    description: "The frontend gracefully adapts when the API does not expose extra capabilities.",
  },
];

export function AuthLayout() {
  return (
    <main className="min-h-screen">
      <div className="container grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden lg:block">
          <div className="surface relative overflow-hidden p-10">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-secondary/80 blur-3xl" />
            <Badge className="mb-6 w-fit" variant="outline">
              PixShare Frontend
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.05em] text-foreground">
                Thoughtful photo sharing, wrapped around your existing API.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                This interface is designed to feel polished and production-ready while
                staying disciplined about the backend contract you already have.
              </p>
            </div>
            <div className="mt-10 space-y-4">
              {features.map(({ description, icon: Icon, title }) => (
                <div
                  key={title}
                  className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5"
                >
                  <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Icon className="size-4.5" />
                  </div>
                  <h2 className="text-base font-semibold">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto w-full max-w-md">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
