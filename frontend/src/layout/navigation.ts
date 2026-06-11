import type { LucideIcon } from "lucide-react";
import { CalendarDays, FileText, Home, LayoutDashboard, Settings, Stethoscope, Users, WalletCards } from "lucide-react";
import type { Role } from "@/types/api";

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: Role[];
};

export const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/doctor",
    icon: LayoutDashboard,
    roles: ["DOCTOR"]
  },
  {
    label: "Dashboard",
    path: "/secretary",
    icon: Home,
    roles: ["SECRETARY"]
  },
  {
    label: "Patients",
    path: "/patients",
    icon: Users,
    roles: ["DOCTOR", "SECRETARY"]
  },
  {
    label: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
    roles: ["DOCTOR", "SECRETARY"]
  },
  {
    label: "Visits",
    path: "/visits",
    icon: Stethoscope,
    roles: ["DOCTOR"]
  },
  {
    label: "Prescriptions",
    path: "/prescriptions",
    icon: FileText,
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

export function getNavigationItem(pathname: string) {
  return navigationItems.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));
}
