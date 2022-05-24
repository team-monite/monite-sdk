import { ReactNode } from 'react';

import { ClerkProvider } from '@clerk/nextjs';

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
      <html lang="en">
        <body className={themeFont.className}>
          <ThemeRegistry>{children}</ThemeRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}
