'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Menu, Search, User } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function DashboardHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="z-40 py-4 bg-white shadow-sm">
      <div className="container flex items-center justify-between h-full px-6 mx-auto">
        {/* Mobile hamburger */}
        <Button
          className="lg:hidden"
          variant="ghost"
          size="icon"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Search */}
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input
              className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-500 bg-gray-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              type="text"
              placeholder="Search for tasks, locations, or employees..."
              aria-label="Search"
            />
          </div>
        </div>

        <div className="flex items-center flex-shrink-0 space-x-6">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/api/auth/signout">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
