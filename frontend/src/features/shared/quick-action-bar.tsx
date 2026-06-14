import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuickAction } from "@/types/workflow";
import { cn } from "@/lib/utils";

type QuickActionBarProps = {
  title: string;
  description?: string;
  actions: QuickAction[];
  onAction?: (action: QuickAction) => void;
  className?: string;
};

export function QuickActionBar({ title, description, actions, onAction, className }: QuickActionBarProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <p className="clinic-kicker">Quick actions</p>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => (
            <Button
              key={action.id}
              type="button"
              variant="outline"
              className={cn("h-auto justify-between rounded-2xl px-4 py-4 text-left hover:border-primary/40 hover:bg-accent/60", action.context && "items-start")}
              onClick={() => onAction?.(action)}
            >
              <span className="min-w-0">
                <span className="block font-semibold">{action.label}</span>
                {action.context ? <span className="mt-1 block text-xs font-normal text-muted-foreground">{action.context}</span> : null}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
