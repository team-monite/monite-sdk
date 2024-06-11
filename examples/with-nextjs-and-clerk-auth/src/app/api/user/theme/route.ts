import { NextRequest, NextResponse } from 'next/server';

import { clerkClient, currentUser } from '@clerk/nextjs';
import { ThemeConfig } from '@team-monite/sdk-demo/src/types';

export async function GET(): Promise<NextResponse<ThemeConfig>> {
  const user = await currentUser();

  if (user === null) {
    throw new Error('No current user available');
  }

  const { variant, mode } = user.privateMetadata
    ?.selectedTheme as Partial<ThemeConfig>;

  return NextResponse.json({
    variant: variant ?? 'monite',
    mode: mode ?? 'light',
  });
}

export async function PUT(
  request: NextRequest
): Promise<NextResponse<ThemeConfig>> {
  const user = await currentUser();
  const { variant, mode } = (await request.json()) as Partial<ThemeConfig>;

  if (user === null) {
    throw new Error('No current user available');
  }

  if (variant === undefined || !['monite', 'material'].includes(variant)) {
    throw new Error('The selected theme variant is invalid');
  }

  if (mode === undefined || !['light', 'dark'].includes(mode)) {
    throw new Error('The selected theme mode is invalid');
  }

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: { selectedTheme: { variant, mode } },
  });

  return NextResponse.json({ variant, mode });
}
