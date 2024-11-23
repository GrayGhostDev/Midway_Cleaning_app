"use client";

import { Metadata } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  FileText,
  Star,
  Settings2
} from "lucide-react";

const tabs = [
  { value: "dashboard", label: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { value: "services", label: "Services", href: "/portal/services", icon: Calendar },
  { value: "payments", label: "Payments", href: "/portal/payments", icon: CreditCard },
  { value: "feedback", label: "Feedback", href: "/portal/feedback", icon: Star },
  { value: "messages", label: "Messages", href: "/portal/messages", icon: MessageSquare },
  { value: "documents", label: "Documents", href: "/portal/documents", icon: FileText },
  { value: "settings", label: "Settings", href: "/portal/settings", icon: Settings2 },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div className="border-b">
        <div className="flex h-14 items-center px-4">
          <nav className="flex items-center space-x-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
              
              return (
                <Link
                  key={tab.value}
                  href={tab.href}
                  className={cn(
                    "flex items-center space-x-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors hover:text-primary",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}