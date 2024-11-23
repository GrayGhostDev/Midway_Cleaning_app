"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center space-x-4 md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-8 w-8">
                <Image
                  src="/midway-logo.png"
                  alt="Midway Cleaning Co."
                  width={32}
                  height={32}
                  className="logo-spin absolute inset-0 w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold">Midway Cleaning Co.</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Add any right-side navigation items here */}
          </div>
        </div>
      </div>
    </nav>
  );
}