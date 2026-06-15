import * as React from "react";
import { BellRing, Building2, ExternalLink, Save, ShieldCheck, SlidersHorizontal, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/auth-provider";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { changeLanguage, languageOptions, normalizeLanguage, type SupportedLanguage } from "@/i18n";

type Preference = {
  id: string;
  enabled: boolean;
};

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { notify } = useNotifications();
  const [preferences, setPreferences] = React.useState<Preference[]>([
    { id: "queue", enabled: true },
    { id: "appointments", enabled: true },
    { id: "compact", enabled: false }
  ]);
  const currentLanguage = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? "en";

  function togglePreference(id: string) {
    setPreferences((current) => current.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item));
  }

  function handleSave() {
    notify({ type: "success", title: t("settings.saved"), description: t("settings.savedDescription") });
  }

  return (
    <div className="clinic-page">
      <section className="clinic-page-header">
        <div>
          <p className="clinic-kicker">{t("settings.kicker")}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t("settings.description")}
          </p>
        </div>
        <Button type="button" size="lg" onClick={handleSave}>
          <Save className="h-4 w-4" />
          {t("settings.save")}
        </Button>
      </section>

      <Tabs defaultValue="profile">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 rounded-2xl border bg-card p-2 shadow-sm">
          <TabsTrigger value="profile"><UserRound className="me-2 h-4 w-4" />{t("settings.tabs.profile")}</TabsTrigger>
          <TabsTrigger value="clinic"><Building2 className="me-2 h-4 w-4" />{t("settings.tabs.clinic")}</TabsTrigger>
          <TabsTrigger value="preferences"><SlidersHorizontal className="me-2 h-4 w-4" />{t("settings.tabs.preferences")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.profile.title")}</CardTitle>
              <CardDescription>{t("settings.profile.description")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label={t("settings.profile.fullName")}><Input defaultValue={user?.name ?? ""} /></Field>
              <Field label={t("settings.profile.email")}><Input type="email" defaultValue={user?.email ?? ""} /></Field>
              <Field label={t("settings.profile.role")}><Input value={user ? t(`common.roles.${user.role}`) : ""} readOnly /></Field>
              <Field label={t("settings.profile.language")}>
                <Select value={currentLanguage} onValueChange={(value) => void changeLanguage(value as SupportedLanguage)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => <SelectItem key={option.code} value={option.code}>{t(option.labelKey)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinic">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.clinic.title")}</CardTitle>
                <CardDescription>{t("settings.clinic.description")}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field label={t("settings.clinic.name")}><Input defaultValue={t("app.name")} /></Field>
                <Field label={t("settings.clinic.phone")}><Input defaultValue="+966 50 000 0000" /></Field>
                <Field label={t("settings.clinic.address")}><Input key={currentLanguage} defaultValue={t("settings.clinic.defaultAddress")} /></Field>
                <Field label={t("settings.clinic.workingHours")}><Input defaultValue="08:00 - 17:00" /></Field>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <CardTitle className="text-base">{t("settings.clinic.protected")}</CardTitle>
                <CardDescription>{t("settings.clinic.protectedDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="outline" className="w-full justify-between">
                  {t("settings.clinic.review")}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.preferences.title")}</CardTitle>
              <CardDescription>{t("settings.preferences.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {preferences.map((preference) => (
                <button
                  key={preference.id}
                  type="button"
                  className="clinic-focus flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-start transition hover:bg-muted/50"
                  onClick={() => togglePreference(preference.id)}
                  aria-pressed={preference.enabled}
                >
                  <span className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                      <BellRing className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{t(`settings.preferences.${preference.id}`)}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{t(`settings.preferences.${preference.id}Description`)}</span>
                    </span>
                  </span>
                  <span className={preference.enabled ? "relative h-7 w-12 rounded-full bg-primary" : "relative h-7 w-12 rounded-full bg-muted"}>
                    <span className={preference.enabled ? "absolute end-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm" : "absolute start-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm"} />
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
