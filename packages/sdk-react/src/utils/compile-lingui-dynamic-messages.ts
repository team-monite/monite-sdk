import { Messages } from '@lingui/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import { compileMessage } from '@lingui/message-utils/compileMessage';

export async function compileLinguiDynamicMessages<
  T extends { context: string; message: string } | string | object
>(messages: Record<string, T>) {
  const compiledMessages: Messages = {};

  await Promise.all(
    Object.entries(messages).map(([key, value]) => {
      if (typeof value === 'string') {
        const compiledMessage = compileMessage(value || key);
        compiledMessages[key] = compiledMessage;

        return generateLinguiMessageId(key).then((id) => {
          compiledMessages[id] = compiledMessage;
        });
      } else if (isMessageWithContext(value)) {
        const { message, context } = value;
        const compiledMessage = compileMessage(message || key);
        compiledMessages[key] = compiledMessage;

        return generateLinguiMessageId(key, context).then((id) => {
          compiledMessages[id] = compiledMessage;
        });
      } else {
        compiledMessages[key] = value;
      }

      return Promise.resolve();
    })
  );

  return compiledMessages;
}

const isMessageWithContext = (
  message: unknown
): message is {
  context: string;
  message: string;
} => {
  return Boolean(
    message &&
      typeof message === 'object' &&
      'context' in message &&
      'message' in message &&
      typeof (message as { context: unknown }).context === 'string' &&
      typeof (message as { message: unknown }).message === 'string'
  );
};

const UNIT_SEPARATOR = '\u001F';

export async function generateLinguiMessageId(messageId: string, context = '') {
  const encoder = new TextEncoder();
  const data = encoder.encode(messageId + UNIT_SEPARATOR + (context || ''));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return toBase64(hashArray).slice(0, 6);
}

export function toBase64(input: number[]) {
  const characters =
    // eslint-disable-next-line lingui/no-unlocalized-strings
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let pad = 0;
  let current = 0;

  for (let i = 0; i < input.length; i += 3) {
    current = (input[i] << 16) | (input[i + 1] << 8) | input[i + 2];
    pad = i + 1 < input.length ? (i + 2 < input.length ? 0 : 1) : 2;

    result += characters[current >> 18];
    result += characters[(current >> 12) & 63];
    result += pad < 2 ? characters[(current >> 6) & 63] : '=';
    result += pad < 1 ? characters[current & 63] : '=';
  }

  return result;
}
