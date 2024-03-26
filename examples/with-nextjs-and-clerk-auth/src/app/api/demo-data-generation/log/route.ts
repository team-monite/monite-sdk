import mqtt from 'mqtt';
import { NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs';

import { getCurrentUserEntity } from '@/lib/clerk-api/get-current-user-entity';
import type { DemoDataGenerationMessage } from '@/lib/monite-api/demo-data-generator/generate-payables';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const { userId, organization } = auth();
  if (!userId)
    return NextResponse.json(
      { error: 'Unauthorized: no "userId"' },
      { status: 401 }
    );

  const { entity_id } = await getCurrentUserEntity();
  if (!entity_id)
    return NextResponse.json(
      { error: 'Unauthorized: no "entity_id"' },
      { status: 401 }
    );

  const mqttClient = mqtt.connect(
    `mqtt://localhost:${process.env.DEMO_DATA_GENERATOR_MQTT_SERVER_PORT}`
  );

  const [cancelTimeout, resetTimeout] = (() => {
    let timeout: ReturnType<typeof setTimeout>;
    return [
      () => {
        clearTimeout(timeout);
      },
      () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          handleEnd('Timeout exceeded');
        }, 20_000);
      },
    ];
  })();

  const handleEnd = async (message?: string) => {
    mqttClient.end();
    cancelTimeout();

    await writer.ready;
    if (typeof message === 'string')
      await writer.write(encoder.encode(`data: ${message}\n\n`));

    await writer.write(encoder.encode(`event: close\n`));
    await writer.write(encoder.encode(`data: success\n\n`));
    await writer.close();
  };

  const handleError = async (error: unknown) => {
    mqttClient.end();
    cancelTimeout();

    await writer.ready;
    await writer.abort(error);
  };

  const handleDemoDataGeneratorMessage = async (
    message: DemoDataGenerationMessage
  ) => {
    await writer.ready;

    if ('error' in message) {
      return handleError(message.error);
    }

    if ('success' in message) {
      return handleEnd(message.success);
    }

    resetTimeout();
    await writer.write(encoder.encode(`data: ${message.message}\n\n`));
  };

  mqttClient.subscribe(`demo-data-generation-log/${entity_id}`, () => {
    mqttClient.on('message', (topic, message) => {
      if (topic !== `demo-data-generation-log/${entity_id}`) return;
      handleDemoDataGeneratorMessage(JSON.parse(message.toString()));
    });
  });

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
