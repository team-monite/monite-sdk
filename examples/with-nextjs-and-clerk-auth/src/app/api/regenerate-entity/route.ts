import { NextResponse } from 'next/server';

import { auth, clerkClient } from '@clerk/nextjs';

import { getCurrentUserEntity } from '@/lib/clerk-api/get-current-user-entity';
import { recreateOrganizationEntity } from '@/lib/clerk-api/recreate-organization-entity';
import { fetchTokenServer } from '@/lib/monite-api/fetch-token';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { userId, orgRole, orgId } = auth();
  if (!userId)
    return NextResponse.json(
      { error: 'Unauthorized: no "userId"' },
      { status: 401 }
    );

  if (!orgRole)
    return NextResponse.json(
      { error: 'Unauthorized: no "orgRole"' },
      { status: 401 }
    );
  if (orgRole !== 'admin')
    return NextResponse.json(
      { error: 'Unauthorized: no matching "orgRole"' },
      { status: 403 }
    );

  if (!orgId)
    return NextResponse.json(
      { error: 'Unauthorized: no "orgId"' },
      { status: 401 }
    );

  const { entity_id } = await getCurrentUserEntity();

  if (!entity_id)
    return NextResponse.json(
      { error: 'Unauthorized: no "entity_id"' },
      { status: 401 }
    );

  const token = await fetchTokenServer({ grant_type: 'client_credentials' });

  const { entity_id: newEntityId } = await recreateOrganizationEntity({
    organizationId: orgId,
    token,
    clerkClient,
  });

  if (!newEntityId)
    return NextResponse.json(
      { error: '"entity_id" is not set after migration' },
      {
        status: 500,
      }
    );

  return NextResponse.json({ success: true });
}
