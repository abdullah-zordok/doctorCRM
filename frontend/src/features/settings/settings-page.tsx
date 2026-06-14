import * as React from "react";
import { BellRing, Building2, ExternalLink, Save, ShieldCheck, SlidersHorizontal, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/auth-provider";
import { useNotifications } from "@/features/notifications/notifications-provider";

type Preference = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export function SettingsPage() {
  const { user } = useAuth();
  const { notify } = useNotifications();
  const [preferences, setPreferences] = React.useState<Preference[]>([
    { id: "queue", label: "Queue alerts", description: "Show a notification when a patient is waiting.", enabled: true },
    { id: "appointments", label: "Appointment reminders", description: "Highlight appointments approaching within 30 minutes.", enabled: true },
    { id: "compact", label: "Compact table rows", description: "Use a denser layout for high-volume reception work.", enabled: false }
  ]);

  function togglePreference(id: string) {
    setPreferences((current) => current.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item));
  }

  function handleSave() {
    notify({ type: "success", title: "Settings saved", description: "Your local clinic preferences have been updated." });
  }

  return (
    <div className="clinic-page">
      <section className="clinic-page-header">
        <div>
          <p className="clinic-kicker">Clinic administration</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Keep profile, clinic information, notifications, and workspace preferences in one consistent place.
          </p>
        </div>
        <Button type="button" size="lg" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save changes
        </Button>
      </section>

      <Tabs defaultValue="profile">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 rounded-2xl border bg-card p-2 shadow-sm">
          <TabsTrigger value="profile"><UserRound className="mr-2 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="clinic"><Building2 className="mr-2 h-4 w-4" />Clinic</TabsTrigger>
          <TabsTrigger value="preferences"><SlidersHorizontal className="mr-2 h-4 w-4" />Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile settings</CardTitle>
              <CardDescription>Account identity is provided by the authenticated clinic user.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label="Full name"><Input defaultValue={user?.name ?? ""} /></Field>
              <Field label="Email"><Input type="email" defaultValue={user?.email ?? ""} /></Field>
              <Field label="Role"><Input value={user?.role === "DOCTOR" ? "Doctor" : "Secretary"} readOnly /></Field>
              <Field label="Language"><Input value="English" readOnly /></Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinic">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Clinic information</CardTitle>
                <CardDescription>Displayed on the workspace and printable clinic documents.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field label="Clinic name"><Input defaultValue="Doctor Clinic" /></Field>
                <Field label="Phone"><Input defaultValue="+966 50 000 0000" /></Field>
                <Field label="Address"><Input defaultValue="Riyadh, Saudi Arabia" /></Field>
                <Field label="Working hours"><Input defaultValue="08:00 - 17:00" /></Field>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <CardTitle className="text-base">Protected workspace</CardTitle>
                <CardDescription>Doctor and Secretary permissions remain controlled by existing role access.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="outline" className="w-full justify-between">
                  Review access policy
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Workspace preferences</CardTitle>
              <CardDescription>Adjust visual and notification behavior for daily clinic work.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {preferences.map((preference) => (
                <button
                  key={preference.id}
                  type="button"
                  className="clinic-focus flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition hover:bg-muted/50"
                  onClick={() => togglePreference(preference.id)}
                  aria-pressed={preference.enabled}
                >
                  <span className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                      <BellRing className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{preference.label}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{preference.description}</span>
                    </span>
                  </span>
                  <span className={preference.enabled ? "relative h-7 w-12 rounded-full bg-primary" : "relative h-7 w-12 rounded-full bg-muted"}>
                    <span className={preference.enabled ? "absolute right-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm" : "absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm"} />
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
