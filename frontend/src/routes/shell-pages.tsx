import { Bell, CheckCircle2, Clock, LayoutDashboard, Search, ShieldCheck, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { SearchInput } from "@/components/ui/search-input";
import { PageSkeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/auth-provider";
import { useNotifications } from "@/features/notifications/notifications-provider";

const foundationCards = [
  {
    title: "Authentication",
    description: "Role-aware session routing and protected shell access.",
    icon: ShieldCheck
  },
  {
    title: "Application shell",
    description: "Persistent sidebar, top navigation, breadcrumbs, and user menu.",
    icon: LayoutDashboard
  },
  {
    title: "Global search",
    description: "Patient lookup is available from every protected page.",
    icon: Search
  },
  {
    title: "Notifications",
    description: "Non-blocking workflow feedback for success, error, warning, and info.",
    icon: Bell
  }
];

function FoundationOverview({ roleLabel }: { roleLabel: string }) {
  const { notify } = useNotifications();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <Badge variant="success">SPEC 01 complete surface</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-normal">{roleLabel} workspace foundation</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            The reusable shell, shared states, responsive navigation, global patient search, and notifications are ready for clinic workflow screens.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => notify({ type: "success", title: "Notification system ready", description: "Future workflows can reuse this feedback channel." })}
        >
          Test notification
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {foundationCards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <card.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="text-base">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Tabs defaultValue="states">
        <TabsList>
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>
        <TabsContent value="states">
          <div className="grid gap-4 xl:grid-cols-3">
            <EmptyState title="Empty state" description="Future screens can guide users when no clinic records are available." actionLabel="Primary action" onAction={() => notify({ type: "info", title: "Empty state action", description: "Actions can be attached where appropriate." })} />
            <ErrorState title="Error state" description="Recoverable errors keep the shell usable and visible." onRetry={() => notify({ type: "warning", title: "Retry requested", description: "The retry hook is ready for real data screens." })} />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Loading state</CardTitle>
                <CardDescription>Skeleton loading avoids blocking future pages.</CardDescription>
              </CardHeader>
              <CardContent>
                <PageSkeleton />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reusable controls</CardTitle>
              <CardDescription>Buttons, badges, inputs, cards, tabs, tables, dialogs, menus, and pagination share the same design system.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-[1fr_auto]">
              <SearchInput placeholder="Reusable search input" />
              <div className="flex flex-wrap items-center gap-2">
                <Badge>Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function DoctorHomePage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <WelcomeCard role="Doctor" name={user?.name} />
      <FoundationOverview roleLabel="Doctor" />
    </div>
  );
}

export function SecretaryHomePage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <WelcomeCard role="Secretary" name={user?.name} />
      <FoundationOverview roleLabel="Secretary" />
    </div>
  );
}

function WelcomeCard({ role, name }: { role: string; name?: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <UserRound className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Signed in as {role}</p>
            <h2 className="text-xl font-semibold tracking-normal">{name ?? "Clinic user"}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" aria-hidden="true" />
          Ready for clinic workflows
        </div>
      </CardContent>
    </Card>
  );
}

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge variant="outline">Future module</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-normal">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
      </section>
      <EmptyState title={`${title} content is not implemented yet`} description="This route exists to validate shell navigation, breadcrumbs, responsive behavior, and protected access. Detailed workflows belong to the next specification." />
    </div>
  );
}
