import { Home, Settings, Calendar, Users, BarChart } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Bookings', href: '/dashboard/bookings' },
    { icon: Users, label: 'Customers', href: '/dashboard/customers' },
    { icon: BarChart, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 bg-gray-900 min-h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <item.icon className="mr-3 h-6 w-6" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
} 