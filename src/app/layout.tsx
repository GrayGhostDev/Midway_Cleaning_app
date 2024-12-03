import { ClerkProvider } from '@clerk/nextjs';
import { Suspense } from 'react';
import { Navbar, NavbarFallback } from '@/components/navigation/Navbar';
import { Sidebar, SidebarFallback } from '@/components/navigation/Sidebar';
import { Footer, FooterFallback } from '@/components/navigation/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Midway Cleaning Co.</title>
        </head>
        <body>
          <div className="min-h-screen bg-background">
            <div className="flex h-screen">
              <Suspense fallback={<SidebarFallback />}>
                <Sidebar open={true} onClose={() => {}} />
              </Suspense>
              <div className="flex-1 flex flex-col">
                <Suspense fallback={<NavbarFallback />}>
                  <Navbar onMenuClick={() => {}} />
                </Suspense>
                <main className="flex-1 overflow-auto p-6">{children}</main>
                <Suspense fallback={<FooterFallback />}>
                  <Footer />
                </Suspense>
              </div>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
