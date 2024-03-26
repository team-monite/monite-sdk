import { NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs';

import { getCurrentUserEntity } from '@/lib/clerk-api/get-current-user-entity';
import { generateEntity } from '@/lib/monite-api/demo-data-generator/generate-entity';
import { fetchTokenServer } from '@/lib/monite-api/fetch-token';
import { createMqttMessenger } from '@/lib/mqtt/create-mqtt-messenger';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

export async function POST() {
  if (process.env.GENERATE_ENTITY_DEMO_DATA !== 'true') {
    return NextResponse.json(
      { error: 'Demo data generation disabled' },
      { status: 400 }
    );
  }

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

  if (!entity_id)
    return NextResponse.json(
      { error: '"entity_id" is not set after migration' },
      {
        status: 500,
      }
    );

  const { publishMessage, closeMqttConnection } = createMqttMessenger(
    `demo-data-generation-log/${entity_id}`
  );

  await generateEntity(
    { entity_id },
    {
      logger: publishMessage,
      token,
    }
  ).finally(() => void closeMqttConnection());

  return NextResponse.json({ success: true });
}
