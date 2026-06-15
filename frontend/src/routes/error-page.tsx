import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();
  const title = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : t("errors.pageUnavailable");
  const description = isRouteErrorResponse(error) ? error.data : t("errors.pageDescription");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{String(description)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/">{t("errors.return")}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
