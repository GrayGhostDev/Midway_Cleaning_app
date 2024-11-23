"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Package,
  BarChart2,
  Building2,
  Wrench,
  GraduationCap,
  ClipboardCheck,
  Smartphone,
  Settings,
  UserCircle,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Tasks", href: "/tasks", icon: ClipboardList },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Equipment", href: "/equipment", icon: Wrench },
  { name: "Locations", href: "/locations", icon: Building2 },
  { name: "Training", href: "/training", icon: GraduationCap },
  { name: "Quality", href: "/quality", icon: ClipboardCheck },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Client Portal", href: "/portal", icon: UserCircle },
  { name: "Mobile", href: "/mobile", icon: Smartphone },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-6 w-6">
            <img
              src="/midway-logo.png"
              alt="Midway Cleaning Co."
              className="logo-spin absolute inset-0 w-full h-full object-contain"
            />
          </div>
          <span className="text-lg font-bold">Midway</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}