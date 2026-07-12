import { motion } from "framer-motion";
import { Ghost } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <main className="container flex min-h-screen items-center justify-center py-10">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="max-w-lg overflow-hidden">
          <CardContent className="flex flex-col items-center gap-6 px-8 py-12 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Ghost className="size-7" />
            </span>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                404
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.04em]">
                This page stepped out of frame
              </h1>
              <p className="text-sm leading-7 text-muted-foreground">
                The route you opened does not exist in the frontend experience we built
                around your current PixShare backend.
              </p>
            </div>
            <Button asChild>
              <Link to="/feed">Return to feed</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
