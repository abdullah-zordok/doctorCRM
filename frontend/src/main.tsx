/* eslint-disable react-refresh/only-export-components */
import React from "react";
import ReactDOM from "react-dom/client";
import { DirectionProvider } from "@radix-ui/react-direction";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider, useTranslation } from "react-i18next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/auth-provider";
import { NotificationsProvider } from "@/features/notifications/notifications-provider";
import i18n, { getDirection } from "@/i18n";
import { queryClient } from "@/lib/query-client";
import { router } from "@/routes/router";
import "@/styles/globals.css";

function Application() {
  const { i18n: translation } = useTranslation();
  const direction = getDirection(translation.resolvedLanguage ?? translation.language);

  return (
    <DirectionProvider dir={direction}>
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider>
          <TooltipProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </TooltipProvider>
        </NotificationsProvider>
      </QueryClientProvider>
    </DirectionProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Application />
    </I18nextProvider>
  </React.StrictMode>
);
