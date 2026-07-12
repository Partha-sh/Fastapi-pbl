import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
import { loginUser, registerUser } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/format";

const registerSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setSubmitting(true);
      await registerUser(values);

      try {
        const response = await loginUser({
          email: values.email,
          password: values.password,
        });
        login(response.access_token);
        toast.success("Account created. You’re now signed in.");
        navigate("/feed", { replace: true });
        return;
      } catch {
        toast.success("Account created. Please sign in.");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.35 }}
    >
      <Card>
        <CardHeader className="space-y-6">
          <Logo />
          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-[-0.04em]">
              Create your PixShare account
            </CardTitle>
            <CardDescription className="text-sm leading-6">
              Registration posts directly to the existing `/auth/register` route, then
              signs you in with the backend&apos;s JWT login flow.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                {...form.register("username")}
              />
              {form.formState.errors.username ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.username.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Create a password"
                type="password"
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>
            <Button className="w-full" disabled={submitting} type="submit">
              {submitting ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link className="font-semibold text-foreground" to="/login">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
