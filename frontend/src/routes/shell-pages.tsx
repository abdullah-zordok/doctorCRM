import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

type PlaceholderPageProps = {
  titleKey: string;
  descriptionKey: string;
};

export function PlaceholderPage({ titleKey, descriptionKey }: PlaceholderPageProps) {
  const { t } = useTranslation();
  const title = t(titleKey);

  return (
    <div className="clinic-page">
      <section className="clinic-page-header">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge variant="outline">{t("payments.future")}</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{t(descriptionKey)}</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
      </section>
      <Card>
        <CardContent className="p-6">
          <EmptyState
            title={t("payments.notImplemented", { title })}
            description={t("payments.notImplementedDescription")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
