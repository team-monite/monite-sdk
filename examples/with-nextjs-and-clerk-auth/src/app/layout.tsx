import { ReactNode } from 'react';

import { ClerkProvider, MultisessionAppSupport } from '@clerk/nextjs';

import { RootQueryClientProvider } from '@/components/RootQueryClientProvider';
import { themeFont } from '@/components/ThemeRegistry/themeFont';
import { ThemeRegistry } from '@/components/ThemeRegistry/ThemeRegistry';

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
            <ThemeRegistry>
              <RootQueryClientProvider>{children}</RootQueryClientProvider>
            </ThemeRegistry>
          </body>
        </html>
      </MultisessionAppSupport>
    </ClerkProvider>
  );
}
