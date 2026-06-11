import type { LucideIcon } from "lucide-react";
import { CalendarDays, FileText, Home, LayoutDashboard, Settings, Stethoscope, Users, WalletCards } from "lucide-react";
import type { Role } from "@/types/api";
import { workflowRoutes } from "@/routes/workflow-routes";

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: Role[];
  isActive?: (pathname: string) => boolean;
};

export const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    path: workflowRoutes.doctorDashboard,
    icon: LayoutDashboard,
    roles: ["DOCTOR"]
  },
  {
    label: "Dashboard",
    path: workflowRoutes.secretaryDashboard,
    icon: Home,
    roles: ["SECRETARY"]
  },
  {
    label: "Patients",
    path: workflowRoutes.patients,
    icon: Users,
    isActive: (pathname) => pathname === workflowRoutes.patients || pathname.startsWith(`${workflowRoutes.patients}/`),
    roles: ["DOCTOR", "SECRETARY"]
  },
  {
    label: "Appointments",
    path: workflowRoutes.appointments,
    icon: CalendarDays,
    roles: ["DOCTOR", "SECRETARY"]
  },
  {
    label: "Visits",
    path: "/visits",
    icon: Stethoscope,
    isActive: (pathname) => pathname.startsWith("/visits") && !pathname.includes("/prescriptions/"),
    roles: ["DOCTOR"]
  },
  {
    label: "Prescriptions",
    path: "/prescriptions",
    icon: FileText,
    isActive: (pathname) => pathname === "/prescriptions" || pathname.includes("/prescriptions/"),
    roles: ["DOCTOR"]
  },
  {
    label: "Payments",
    path: "/payments",
    icon: WalletCards,
    roles: ["DOCTOR", "SECRETARY"]
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["DOCTOR", "SECRETARY"]
  }
];

export function getNavigationForRole(role: Role) {
  return navigationItems.filter((item) => item.roles.includes(role));
}

export function isNavigationItemActive(item: NavItem, pathname: string) {
  return item.isActive ? item.isActive(pathname) : pathname === item.path || pathname.startsWith(`${item.path}/`);
}

export function getNavigationItem(pathname: string) {
  return navigationItems.find((item) => isNavigationItemActive(item, pathname));
}
