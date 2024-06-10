import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUserPrivateMetadata } from '@/lib/clerk-api/get-current-user-private-metadata';
import { setCurrentUserPrivateMetadata } from '@/lib/clerk-api/set-current-user-private-metadata';
import { PrivateMetadata, SelectedTheme } from '@/lib/clerk-api/types';

export async function GET(): Promise<NextResponse<PrivateMetadata>> {
  const metadata = await getCurrentUserPrivateMetadata();

  return NextResponse.json({
    selectedTheme: metadata?.selectedTheme ?? ['monite', 'light'],
  });
}

export async function PUT(
  request: NextRequest
): Promise<NextResponse<PrivateMetadata>> {
  const nextMetadata = (await request.json()) as Partial<PrivateMetadata>;

  await setCurrentUserPrivateMetadata(nextMetadata);

  return NextResponse.json({
    selectedTheme: nextMetadata.selectedTheme as SelectedTheme,
  });
}
