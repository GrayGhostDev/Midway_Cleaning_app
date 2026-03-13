'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
  Briefcase,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Services', href: '/services', icon: Briefcase },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Tasks', href: '/tasks', icon: ClipboardList },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Equipment', href: '/equipment', icon: Wrench },
  { name: 'Locations', href: '/locations', icon: Building2 },
  { name: 'Training', href: '/training', icon: GraduationCap },
  { name: 'Quality', href: '/quality', icon: ClipboardCheck },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Client Portal', href: '/portal', icon: UserCircle },
  { name: 'Mobile', href: '/mobile', icon: Smartphone },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function SidebarFallback() {
  return (
    <div className="hidden lg:flex w-64 h-screen bg-background border-r animate-pulse" />
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-screen w-64 shrink-0 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/midway-logo.svg"
            alt="Midway Cleaning Co."
            width={28}
            height={28}
            unoptimized
          />
          <span className="text-lg font-bold">Midway</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-2">
        <div className="grid gap-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
