import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Calendar,
  ClipboardList,
  FileText,
  Home,
  Settings,
  Users,
  Upload,
  Bell,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardList },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Documents', href: '/dashboard/documents', icon: Upload },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
      <div className="flex h-16 items-center justify-center border-b px-6">
        <h1 className="text-xl font-bold">Midway Cleaning</h1>
      </div>
      <nav className="flex flex-1 flex-col p-4">
        <ul role="list" className="flex flex-1 flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    isActive && 'bg-accent text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
