import { ReactNode } from 'react';

import { ClerkProvider, MultisessionAppSupport } from '@clerk/nextjs';

import { RootQueryClientProvider } from '@/components/RootQueryClientProvider';
import { RootThemeProvider } from '@/components/ThemeRegistry/RootThemeProvider';
import { themeFont } from '@/components/ThemeRegistry/themeFont';

import './globals.css';

export const metadata = {
  title: 'Monite SDK Demo',
  description: 'Monite SDK demo app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.CLERK_PUBLISHABLE_KEY}>
      <MultisessionAppSupport>
        <html lang="en">
          <body className={themeFont.className}>
            <RootThemeProvider>
              <RootQueryClientProvider>{children}</RootQueryClientProvider>
            </RootThemeProvider>
          </body>
        </html>
      </MultisessionAppSupport>
    </ClerkProvider>
  );
}
