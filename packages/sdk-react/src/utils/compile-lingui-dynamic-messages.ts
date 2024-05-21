import { Messages } from '@lingui/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import { compileMessage } from '@lingui/message-utils/compileMessage';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import { generateMessageId } from '@lingui/message-utils/generateMessageId';

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

export async function generateLinguiMessageId(messageId: string, context = '') {
  return generateMessageId(messageId, context);
}
