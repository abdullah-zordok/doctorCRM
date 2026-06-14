import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, ArrowRight, CalendarCheck2, CheckCircle2, HeartPulse, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(166_70%_92%),transparent_34rem),linear-gradient(135deg,hsl(190_45%_98%),hsl(210_35%_95%))]">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -left-28 bottom-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-white/60 blur-3xl" />
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <Activity className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">Doctor Clinic</p>
              <p className="text-sm text-muted-foreground">Healthcare operations platform</p>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <p className="mb-5 inline-flex rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              Calm, connected clinic workflows
            </p>
            <h1 className="max-w-xl text-5xl font-bold tracking-[-0.045em] text-slate-950 xl:text-6xl">
              Better clinic days start with a clear workspace.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Keep patient care, schedules, visits, and prescriptions organized in one role-aware clinic experience.
            </p>

            <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                { icon: HeartPulse, label: "Clinical focus" },
                { icon: CalendarCheck2, label: "Daily schedule" },
                { icon: ShieldCheck, label: "Role protected" }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur">
                  <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-sm text-muted-foreground">Private clinic workspace for Doctor and Secretary teams.</p>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-8 lg:bg-white/35">
          <Card className="w-full max-w-md border-white/80 bg-white/92 shadow-[0_28px_80px_-34px_rgba(15,118,110,0.42)] backdrop-blur-xl">
            <CardHeader className="pb-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground lg:hidden">
                <Activity className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="clinic-kicker">Secure clinic access</p>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to continue to today&apos;s clinic workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input id="email" type="email" autoComplete="email" className="pl-10" placeholder="doctor@example.com" {...form.register("email")} />
                  </div>
                  {form.formState.errors.email ? <p className="text-sm text-destructive">{form.formState.errors.email.message}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input id="password" type="password" autoComplete="current-password" className="pl-10" placeholder="Password" {...form.register("password")} />
                  </div>
                  {form.formState.errors.password ? <p className="text-sm text-destructive">{form.formState.errors.password.message}</p> : null}
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-2 font-medium text-muted-foreground">
                    <input type="checkbox" className="h-4 w-4 rounded border-input text-primary accent-primary" {...form.register("remember")} />
                    Remember me
                  </label>
                  <button type="button" className="clinic-focus rounded-md font-semibold text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </form>

              <div className="mt-6 flex items-center gap-2 rounded-2xl bg-muted/70 px-4 py-3 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                Your account permissions determine the clinic tools available after sign-in.
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
