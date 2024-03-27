import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

import type { WebhookEvent } from '@clerk/clerk-sdk-node';

import type { OrganizationDomainWebhookEvent } from '@/lib/clerk-api/types';
import { webhookEventHandler } from '@/lib/clerk-api/webhook-event-handler';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const stream = req.body as ReadableStream;
  const payload = await readFromStream(stream);

  const httpHeaders = req.headers as unknown as Headers;
  const headers = Object.fromEntries(httpHeaders.entries());
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: 'Clerk webhook signing secret is not set' },
      { status: 500 }
    );
  }

  const wh = new Webhook(secret);

  let verifiedEvent;
  try {
    verifiedEvent = wh.verify(payload, headers) as
      | WebhookEvent
      | OrganizationDomainWebhookEvent;
  } catch (err) {
    console.log(
      `Error verifying webhook payload (MessageID: "${headers['svix-id']}")`
    );
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  console.log(`Webhook "${verifiedEvent.type}" received`);

  try {
    await webhookEventHandler(verifiedEvent);
  } catch (error) {
    console.error(
      `✖︎ Webhook "${verifiedEvent.type}" handling failed (MessageID: "${headers['svix-id']}")\n`,
      error
    );

    return NextResponse.json(
      { error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }

  return NextResponse.json({});
}

const readFromStream = async (stream: ReadableStream) => {
  const reader = stream.getReader();

  let data = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    data += new TextDecoder().decode(value);
  }

  return data;
};
