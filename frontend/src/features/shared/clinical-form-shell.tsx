import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ClinicalFormShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  primaryDisabled?: boolean;
  className?: string;
};

export function ClinicalFormShell({
  title,
  description,
  children,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryDisabled,
  className
}: ClinicalFormShellProps) {
  const { t } = useTranslation();
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b border-border/60 bg-muted/20">
        <p className="clinic-kicker">{t("visits.kicker")}</p>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3 border-t bg-card/95 pt-5 backdrop-blur">
          {secondaryLabel && onSecondary ? (
            <Button type="button" variant="outline" size="lg" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          ) : null}
          <Button type="button" size="lg" onClick={onPrimary} disabled={primaryDisabled}>
            {primaryLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
