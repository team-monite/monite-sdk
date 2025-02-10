'use server';

import { ReactNode } from 'react';

import { ClerkProvider } from '@clerk/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

import { RootI18nProvider } from '@/components/RootI18nProvider';
import { RootQueryClientProvider } from '@/components/RootQueryClientProvider';
import { AppThemeProvider } from '@/components/ThemeRegistry/AppThemeProvider';
import { themeFont } from '@/components/ThemeRegistry/themeFont';

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
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={themeFont.className}>
          <RootI18nProvider>
            <RootQueryClientProvider>
              <AppRouterCacheProvider options={{ key: 'mui' }}>
                <AppThemeProvider>{children}</AppThemeProvider>
              </AppRouterCacheProvider>
            </RootQueryClientProvider>
          </RootI18nProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
