import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Navbar } from '@/components/navigation/Navbar';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsPlacement: 'bottom',
          socialButtonsVariant: 'iconButton',
          termsPageUrl: 'https://clerk.com/terms',
        },
        variables: {
          colorPrimary: '#3b82f6',
          colorText: 'white',
          colorBackground: '#111827',
          colorInputBackground: '#1f2937',
          colorInputText: 'white',
          colorTextOnPrimaryBackground: 'white',
        }
      }}
    >
      <ThemeProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Component {...pageProps} />
          </main>
        </div>
      </ThemeProvider>
    </ClerkProvider>
  );
} 