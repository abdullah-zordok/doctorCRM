import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, ArrowRight, CalendarCheck2, CheckCircle2, HeartPulse, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleHomePath } from "@/features/auth/auth-routes";
import { useAuth } from "@/features/auth/auth-provider";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { ApiError } from "@/lib/api-client";

function createLoginSchema(t: (key: string) => string) {
  return z.object({
    email: z.string().trim().email(t("validation.email")),
    password: z.string().min(8, t("validation.passwordMin")),
    remember: z.boolean().default(true)
  });
}

type LoginForm = z.infer<ReturnType<typeof createLoginSchema>>;

export function LoginPage() {
  const { t } = useTranslation();
  const schema = React.useMemo(() => createLoginSchema(t), [t]);
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
      notify({ type: "success", title: t("auth.welcome"), description: t("auth.signedInAs", { name: user.name }) });
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from && from !== "/login" ? from : roleHomePath(user.role), { replace: true });
    } catch (error) {
      notify({
        type: "error",
        title: t("auth.loginFailed"),
        description: error instanceof ApiError ? error.message : t("auth.loginFallback")
      });
    }
  });

  return (
    <main className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(166_70%_92%),transparent_34rem),linear-gradient(135deg,hsl(190_45%_98%),hsl(210_35%_95%))]">
      <div className="absolute end-4 top-4 z-20 rounded-2xl border border-white/70 bg-white/80 shadow-sm backdrop-blur">
        <LanguageSwitcher />
      </div>
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -left-28 bottom-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-white/60 blur-3xl" />
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <Activity className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">{t("app.name")}</p>
              <p className="text-sm text-muted-foreground">{t("auth.platform")}</p>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <p className="mb-5 inline-flex rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              {t("auth.badge")}
            </p>
            <h1 className="max-w-xl text-5xl font-bold tracking-[-0.045em] text-slate-950 xl:text-6xl">
              {t("auth.heroTitle")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              {t("auth.heroDescription")}
            </p>

            <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                { icon: HeartPulse, label: t("auth.features.clinical") },
                { icon: CalendarCheck2, label: t("auth.features.schedule") },
                { icon: ShieldCheck, label: t("auth.features.protected") }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur">
                  <item.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-sm text-muted-foreground">{t("auth.privateWorkspace")}</p>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-8 lg:bg-white/35">
          <Card className="w-full max-w-md border-white/80 bg-white/92 shadow-[0_28px_80px_-34px_rgba(15,118,110,0.42)] backdrop-blur-xl">
            <CardHeader className="pb-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground lg:hidden">
                <Activity className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="clinic-kicker">{t("auth.secureAccess")}</p>
              <CardTitle className="text-2xl">{t("auth.welcome")}</CardTitle>
              <CardDescription>{t("auth.signInDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input id="email" type="email" autoComplete="email" className="ps-10" placeholder="doctor@example.com" {...form.register("email")} />
                  </div>
                  {form.formState.errors.email ? <p className="text-sm text-destructive">{form.formState.errors.email.message}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input id="password" type="password" autoComplete="current-password" className="ps-10" placeholder={t("auth.passwordPlaceholder")} {...form.register("password")} />
                  </div>
                  {form.formState.errors.password ? <p className="text-sm text-destructive">{form.formState.errors.password.message}</p> : null}
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-2 font-medium text-muted-foreground">
                    <input type="checkbox" className="h-4 w-4 rounded border-input text-primary accent-primary" {...form.register("remember")} />
                    {t("auth.remember")}
                  </label>
                  <button type="button" className="clinic-focus rounded-md font-semibold text-primary hover:underline">
                    {t("auth.forgot")}
                  </button>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? t("auth.signingIn") : t("auth.signIn")}
                  <ArrowRight className="icon-directional h-4 w-4" aria-hidden="true" />
                </Button>
              </form>

              <div className="mt-6 flex items-center gap-2 rounded-2xl bg-muted/70 px-4 py-3 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {t("auth.permissions")}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
