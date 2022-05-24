import { NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs';

import { getCurrentUserEntity } from '@/lib/clerk-api/get-current-user-entity';
import { fetchTokenServer } from '@/lib/monite-api/fetch-token';

export async function GET() {
  const { userId, organization } = auth();

  if (!userId)
    return NextResponse.json(
      { error: 'Unauthorized: no "userId"' },
      { status: 401 }
    );

  const { entity_user_id } = await getCurrentUserEntity();

  if (!entity_user_id || typeof entity_user_id !== 'string')
    return NextResponse.json(
      { error: 'Unauthorized: no "entity_user_id"' },
      { status: 401 }
    );

  try {
    const token = await fetchTokenServer({
      grant_type: 'entity_user',
      entity_user_id,
    });

    return NextResponse.json(token);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : error },
      {
        status: 401,
      }
    );
  }
}
