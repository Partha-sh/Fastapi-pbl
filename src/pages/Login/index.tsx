import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { loginUser } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/format";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);

    try {
      console.log("========== LOGIN START ==========");
      console.log("Submitting:", values);

      const response = await loginUser(values);

      console.log("LOGIN RESPONSE:");
      console.log(response);

      login(response.access_token);

      console.log("TOKEN AFTER LOGIN:");
      console.log(localStorage.getItem("pixshare.token"));

      console.log("ALL LOCAL STORAGE:");
      console.log(localStorage);

      toast.success("Welcome back!");

      alert("Login finished. Check the console.");

      // TEMPORARILY DISABLED
      // navigate("/feed", { replace: true });

    } catch (error) {
      console.error("LOGIN ERROR:");
      console.error(error);

      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card>
        <CardHeader className="space-y-6">
          <Logo />

          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-[-0.04em]">
              Sign in to your workspace
            </CardTitle>

            <CardDescription className="text-sm leading-6">
              Use the existing <code>/auth/login</code> endpoint to enter the
              live feed with your JWT session attached automatically.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...form.register("email")}
              />

              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "Hide password" : "Show password"}
                </button>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                />

                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground">
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </span>
              </div>

              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-semibold text-foreground">
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}