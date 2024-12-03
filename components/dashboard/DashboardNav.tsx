import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Calendar,
  ClipboardList,
  Home,
  Map,
  Package,
  Settings,
  Users,
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardList },
  { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
  { name: 'Locations', href: '/dashboard/locations', icon: Map },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Employees', href: '/dashboard/employees', icon: Users },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 px-3">
      <div className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-white' : 'text-gray-500'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
