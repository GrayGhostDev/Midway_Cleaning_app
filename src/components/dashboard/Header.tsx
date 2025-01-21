import { useAuth, useUser } from '@clerk/nextjs';
import { useTheme } from '@/providers/ThemeProvider';
import { Bell, Menu, Moon, Sun } from 'lucide-react';
import { NotificationSettings } from '../navigation/NotificationSettings';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden">
              <Menu size={20} />
            </button>
            <div className="ml-4 text-xl font-bold text-white">
              Dashboard
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <NotificationSettings />

            {/* User Info */}
            <div className="flex items-center">
              <img
                src={user?.imageUrl}
                alt={user?.fullName || 'User'}
                className="h-8 w-8 rounded-full"
              />
              <span className="ml-2 text-sm font-medium text-white hidden sm:block">
                {user?.fullName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 