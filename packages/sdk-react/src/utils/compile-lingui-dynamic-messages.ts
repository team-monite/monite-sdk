import { Messages } from '@lingui/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import { compileMessage } from '@lingui/message-utils/compileMessage';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import { generateMessageId } from '@lingui/message-utils/generateMessageId';

/**
 * Represents a message object for LinguiJS.
 *
 * @property msgstr is the actual message string that will be displayed.
 * @property msgctxt is an optional property representing the context of the message.
 * It is used to differentiate messages with the same ID but different meanings based on the context.
 *
 * @example With context:
 * ```ts
 * {
 *   msgctxt: "greeting",
 *   msgstr: "Hello"
 * }
 * ```
 *
 * @example Without context:
 * ```ts
 * {
 *   msgstr: "Hello"
 * }
 * ```
 */
type LinguiContextMessage = { msgstr: string; msgctxt?: string };

export function compileLinguiDynamicMessages<
  T extends LinguiContextMessage[] | string | object
>(messages: Record<string, T>) {
  const compiledMessages: Messages = {};

  for (const [messageKey, messageItem] of Object.entries(messages)) {
    // 1. Multiple messages with different contexts and the same key
    if (
      isMessageObject(messageItem) ||
      (Array.isArray(messageItem) && messageItem.every(isMessageObject))
    ) {
      for (const message of Array.isArray(messageItem)
        ? messageItem
        : [messageItem]) {
        const { msgstr, msgctxt = '' } = message;

        const compiledMsgstr = compileMessage(msgstr || messageKey);
        // Lingui uses generated key for the compile-time translations
        compiledMessages[generateLinguiMessageId(messageKey, msgctxt)] =
          compiledMsgstr;

        // Messages with the context used in compile-time translations
        if (!msgctxt) {
          // Lingui uses plain key for the runtime translations
          compiledMessages[messageKey] = compiledMsgstr;
        }
      }
    }
    // 2. Plain messages
    else if (typeof messageItem === 'string') {
      const compiledMsgstr = compileMessage(messageItem || messageKey);
      // Lingui uses generated key for the compile-time translations
      compiledMessages[generateLinguiMessageId(messageKey, undefined)] =
        compiledMsgstr;
      // Lingui uses plain key for the runtime translations
      compiledMessages[messageKey] = compiledMsgstr;
    }
    // 3. Compiled ICU messages
    else if (Array.isArray(messageItem)) {
      compiledMessages[messageKey] = messageItem;
    }
  }

  return compiledMessages;
}

const isMessageObject = (message: unknown): message is LinguiContextMessage => {
  if (!message) return false;
  if (typeof message !== 'object') return false;
  if (!('msgstr' in message)) return false;
  return Object.keys(message).every(
    (key) => key === 'msgctxt' || key === 'msgstr'
  );
};

/**
 * Generates LinguiJS hashed message id base on the message id and context
 *
 * @param messageId `msgid` field from the PO file
 * @param context `msgctxt` field from the PO file
 */
export function generateLinguiMessageId(
  messageId: string,
  context: string | undefined = ''
): string {
  return generateMessageId(messageId, context);
}
