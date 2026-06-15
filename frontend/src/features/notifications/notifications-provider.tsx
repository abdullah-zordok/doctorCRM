/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getDirection } from "@/i18n";
import { cn } from "@/lib/utils";

type NotificationType = "success" | "error" | "warning" | "info";

export type NotificationInput = {
  type: NotificationType;
  title: string;
  description?: string;
};

type Notification = NotificationInput & {
  id: string;
};

type NotificationsContextValue = {
  notify: (notification: NotificationInput) => void;
};

const NotificationsContext = React.createContext<NotificationsContextValue | null>(null);

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info
};

const styles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  error: "border-red-200 bg-red-50 text-red-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  info: "border-sky-200 bg-sky-50 text-sky-950"
};

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const notify = React.useCallback((notification: NotificationInput) => {
    setNotifications((current) => [
      ...current,
      {
        ...notification,
        id: window.crypto.randomUUID()
      }
    ]);
  }, []);

  const remove = React.useCallback((id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  return (
    <NotificationsContext.Provider value={{ notify }}>
      <ToastPrimitive.Provider swipeDirection={getDirection(i18n.resolvedLanguage ?? i18n.language) === "rtl" ? "left" : "right"}>
        {children}
        {notifications.map((notification) => {
          const Icon = icons[notification.type];
          return (
            <ToastPrimitive.Root
              key={notification.id}
              duration={4500}
              onOpenChange={(open) => {
                if (!open) remove(notification.id);
              }}
              className={cn("grid w-full max-w-sm grid-cols-[auto_1fr_auto] gap-3 rounded-lg border p-4 shadow-soft", styles[notification.type])}
            >
              <Icon className="mt-0.5 h-5 w-5" aria-hidden="true" />
              <div>
                <ToastPrimitive.Title className="text-sm font-semibold">{notification.title}</ToastPrimitive.Title>
                {notification.description ? (
                  <ToastPrimitive.Description className="mt-1 text-sm opacity-80">{notification.description}</ToastPrimitive.Description>
                ) : null}
              </div>
              <ToastPrimitive.Close className="clinic-focus rounded p-1 opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
                <span className="sr-only">{t("common.actions.dismiss")}</span>
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          );
        })}
        <ToastPrimitive.Viewport className="fixed end-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:end-6 sm:top-6" />
      </ToastPrimitive.Provider>
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = React.useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return context;
}
