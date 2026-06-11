import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ErrorPage() {
  const error = useRouteError();
  const title = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : "Page unavailable";
  const description = isRouteErrorResponse(error) ? error.data : "The requested page could not be loaded.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{String(description)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/">Return to workspace</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
