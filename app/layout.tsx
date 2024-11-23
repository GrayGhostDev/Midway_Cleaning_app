import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { Sidebar } from '@/components/sidebar';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Midway Cleaning Co.',
  description: 'Professional Cleaning Services Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen">
            <div className="hidden md:block w-64">
              <Sidebar />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navigation />
              <main className="flex-1 overflow-auto">
                <div className="container mx-auto px-4 py-6">
                  {children}
                </div>
              </main>
              <Toaster />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}