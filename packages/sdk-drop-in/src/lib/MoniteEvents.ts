/**
 * Monite Events System
 *
 * This module provides a centralized way to define, emit, and handle Monite events.
 */
import { APISchema } from '@monite/sdk-react';
import type {
  ComponentSettings,
  MoniteReceivablesTableProps,
} from '@monite/sdk-react';

type ReceivableResponseType =
  | APISchema.components['schemas']['InvoiceResponsePayload']
  | undefined;

export enum MoniteEventTypes {
  INVOICE_CREATED = 'invoice.created',
  INVOICE_UPDATED = 'invoice.updated',
  INVOICE_DELETED = 'invoice.deleted',
}

export interface BaseEventPayload {
  id: string;
}

export type InvoiceEventPayload = BaseEventPayload & {
  invoice?: ReceivableResponseType;
};

export type EventPayload = InvoiceEventPayload;

export interface MoniteEvent<T extends EventPayload = EventPayload> {
  id: string;
  type: MoniteEventTypes;
  payload: T;
}

export type EntityHandler<D = unknown> = (id: string, data?: D) => void;
export type EventPayloadCreator<T extends BaseEventPayload, D = unknown> = (
  id: string,
  data?: D
) => T;

export const MONITE_EVENT_PREFIX = 'monite.event';

function generateEventId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  // Fallback to timestamp + random number
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export { generateEventId };

/**
 * Emits a Monite event
 *
 * @param type The type of event to emit
 * @param payload The payload to include with the event
 * @param target Optional target element to emit the event from (defaults to document)
 * @returns Whether the event was successfully emitted
 */
export function emitMoniteEvent<T extends EventPayload>(
  type: MoniteEventTypes,
  payload: T,
  target?: Element
): boolean {
  const event = new CustomEvent<MoniteEvent<T>>(
    `${MONITE_EVENT_PREFIX}:${type}`,
    {
      detail: {
        id: generateEventId(),
        type,
        payload,
      },
      bubbles: true,
      composed: true,
      cancelable: true,
    }
  );

  const targetElement = target ?? document;
  return targetElement.dispatchEvent(event);
}

/**
 * Creates a wrapped handler that calls the original handler and emits an event
 *
 * @param originalHandler The original callback function to wrap
 * @param eventType The type of event to emit
 * @param createPayload A function that creates the event payload
 * @returns A wrapped handler that emits an event when called
 */
export function createEventHandler<T extends BaseEventPayload, D = unknown>(
  originalHandler: EntityHandler<D> | undefined,
  eventType: MoniteEventTypes,
  createPayload: EventPayloadCreator<T, D>
): EntityHandler<D> {
  return (id: string, data?: D) => {
    const payload = createPayload(id, data);
    emitMoniteEvent(eventType, payload);
    originalHandler?.(id, data);
  };
}

/**
 * Enhances receivables settings with event handlers
 *
 * @param settings The original receivables settings
 * @returns Enhanced receivables settings with event handlers
 */
export function enhanceReceivablesSettings(
  settings: ComponentSettings['receivables'] &
    Partial<MoniteReceivablesTableProps> = {}
): ComponentSettings['receivables'] {
  const { onCreate, onUpdate, onDelete, ...rest } = settings;

  return {
    ...rest,
    onCreate: createEventHandler(
      onCreate,
      MoniteEventTypes.INVOICE_CREATED,
      (id) => ({ id })
    ),
    onUpdate: createEventHandler(
      onUpdate,
      MoniteEventTypes.INVOICE_UPDATED,
      (id, invoice) => ({ id, invoice })
    ),
    onDelete: createEventHandler(
      onDelete,
      MoniteEventTypes.INVOICE_DELETED,
      (id) => ({ id })
    ),
  } as ComponentSettings['receivables'];
}

/**
 * Enhances component settings with event handlers
 *
 * @param settings The original component settings
 * @returns Enhanced component settings with event handlers
 */
export function enhanceComponentSettings(
  settings: Partial<ComponentSettings> = {}
): Partial<ComponentSettings> {
  return {
    ...settings,
    receivables: enhanceReceivablesSettings(settings.receivables),
  };
}

/**
 * Adds an event listener for a specific Monite event type
 *
 * @param eventType The type of event to listen for
 * @param callback The callback function to execute when the event occurs
 * @param target Optional target element to attach the listener to (defaults to document)
 * @returns A cleanup function to remove the event listener
 */
export function addMoniteEventListener<T extends EventPayload>(
  eventType: MoniteEventTypes,
  callback: (event: CustomEvent<MoniteEvent<T>>) => void,
  target: Element | Document = document
): () => void {
  const eventName = `${MONITE_EVENT_PREFIX}:${eventType}`;

  target.addEventListener(eventName, callback as EventListener);

  return () => {
    target.removeEventListener(eventName, callback as EventListener);
  };
}
