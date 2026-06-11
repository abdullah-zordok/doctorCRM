import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleHomePath } from "@/features/auth/auth-routes";
import { useAuth } from "@/features/auth/auth-provider";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { ApiError } from "@/lib/api-client";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().default(true)
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      remember: true
    }
  });

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    try {
      const user = await login({ email, password });
      notify({ type: "success", title: "Welcome back", description: `Signed in as ${user.name}` });
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from && from !== "/login" ? from : roleHomePath(user.role), { replace: true });
    } catch (error) {
      notify({
        type: "error",
        title: "Login failed",
        description: error instanceof ApiError ? error.message : "Check your email and password, then try again."
      });
    }
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(166_70%_94%),transparent_32%),linear-gradient(135deg,hsl(190_40%_98%),hsl(210_30%_96%))]">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden flex-col justify-between p-10 lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
              <Activity className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-semibold">Doctor Clinic</p>
              <p className="text-sm text-muted-foreground">Healthcare operations platform</p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 inline-flex rounded-full bg-white/70 px-3 py-1 text-sm font-medium text-primary shadow-sm">
              Calm, fast clinic workflows
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-slate-950">A focused workspace for doctors and clinic teams.</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Sign in once and move through patient search, clinic navigation, notifications, and role-aware work areas from a consistent shell.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">SPEC 01 foundation. Workflow screens follow in later specs.</p>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-8">
          <Card className="w-full max-w-md border-white/70 bg-white/90 backdrop-blur">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:hidden">
                <Activity className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Use your clinic account to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input id="email" type="email" autoComplete="email" className="pl-9" placeholder="doctor@example.com" {...form.register("email")} />
                  </div>
                  {form.formState.errors.email ? <p className="text-sm text-destructive">{form.formState.errors.email.message}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input id="password" type="password" autoComplete="current-password" className="pl-9" placeholder="Password" {...form.register("password")} />
                  </div>
                  {form.formState.errors.password ? <p className="text-sm text-destructive">{form.formState.errors.password.message}</p> : null}
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" className="h-4 w-4 rounded border-input text-primary" {...form.register("remember")} />
                    Remember me
                  </label>
                  <button type="button" className="font-medium text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
