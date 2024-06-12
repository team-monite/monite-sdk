'use server';

import { ReactNode } from 'react';

import { ClerkProvider, MultisessionAppSupport } from '@clerk/nextjs';

import { RootI18nProvider } from '@/components/RootI18nProvider';
import { RootQueryClientProvider } from '@/components/RootQueryClientProvider';
import { RootThemeProvider } from '@/components/ThemeRegistry/RootThemeProvider';
import { themeFont } from '@/components/ThemeRegistry/themeFont';
import { getCurrentUserPrivateMetadata } from '@/lib/clerk-api/get-current-user-private-metadata';

import './globals.css';

export async function generateMetadata() {
  return {
    title: 'Monite SDK Demo',
    description: 'Monite SDK demo app',
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const metadata = await getCurrentUserPrivateMetadata();

  return (
    <ClerkProvider publishableKey={process.env.CLERK_PUBLISHABLE_KEY}>
      <MultisessionAppSupport>
        <html lang="en">
          <body className={themeFont.className}>
            <RootI18nProvider>
              <RootQueryClientProvider>
                <RootThemeProvider initialTheme={metadata?.selectedTheme}>
                  {children}
                </RootThemeProvider>
              </RootQueryClientProvider>
            </RootI18nProvider>
          </body>
        </html>
      </MultisessionAppSupport>
    </ClerkProvider>
  );
}
