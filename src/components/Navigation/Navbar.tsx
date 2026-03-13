'use client';

import Link from 'next/link';
import { useAuth, UserButton } from '@clerk/nextjs';
import { Bell, Menu } from 'lucide-react';
import { useState } from 'react';

export function NavbarFallback() {
  return (
    <div className="h-14 border-b bg-background animate-pulse" />
  );
}

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { isSignedIn } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 sm:px-6">
      <button
        onClick={() => {
          onMenuClick?.();
          setShowMobileMenu(!showMobileMenu);
        }}
        className="mr-4 lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <>
            <Link
              href="/portal"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Client Portal
            </Link>
            <button
              className="relative text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8',
                },
              }}
            />
          </>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
