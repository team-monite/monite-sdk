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

import { MONITE_APP_ELEMENT_NAME } from '../custom-elements/monite-app';

type ReceivableResponseType =
  | APISchema.components['schemas']['InvoiceResponsePayload']
  | undefined;

export enum MoniteEventTypes {
  INVOICE_CREATED = 'invoice.created',
  INVOICE_UPDATED = 'invoice.updated',
  INVOICE_DELETED = 'invoice.deleted',
  PAYMENTS_ONBOARDING_COMPLETED = 'payments.onboarding.completed',
  WORKING_CAPITAL_ONBOARDING_COMPLETED = 'working_capital.onboarding.completed',
  INVOICE_SENT = 'invoice.sent',
}

export interface BaseEventPayload {
  id: string;
}

export interface InvoiceEventPayload extends BaseEventPayload {
  invoice?: ReceivableResponseType;
}

export interface ReceivableEventPayload extends BaseEventPayload {
  response?: APISchema.components['schemas']['EntityBankAccountResponse'];
}

export type EventPayload = InvoiceEventPayload | ReceivableEventPayload;

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

/**
 * Emits a Monite event on the specified target
 *
 * @param type The type of event to emit
 * @param payload The payload to include with the event
 * @param target Optional target element to emit the event from (defaults to auto-detected target)
 * @returns Whether the event was successfully emitted
 */
export function emitMoniteEvent<T extends EventPayload>(
  type: MoniteEventTypes,
  payload: T
): boolean {
  const target = getMoniteAppEventTarget();
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

  return target.dispatchEvent(event);
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
  const { onCreate, onUpdate, onDelete, onInvoiceSent, ...rest } = settings;

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
    onInvoiceSent: createEventHandler(
      onInvoiceSent,
      MoniteEventTypes.INVOICE_SENT,
      (id) => ({ id })
    ),
  } as ComponentSettings['receivables'];
}

/**
 * Enhances onboarding settings with event handlers
 *
 * @param settings The original onboarding settings
 * @returns Enhanced onboarding settings with event handlers
 */
export function enhanceOnboardingSettings(
  settings: ComponentSettings['onboarding'] = {}
): ComponentSettings['onboarding'] {
  const {
    onPaymentOnboardingComplete,
    onWorkingCapitalOnboardingComplete,
    ...rest
  } = settings;

  return {
    ...rest,
    onPaymentOnboardingComplete: createEventHandler(
      onPaymentOnboardingComplete,
      MoniteEventTypes.PAYMENTS_ONBOARDING_COMPLETED,
      (id, response) => ({ id, response })
    ),
    onWorkingCapitalOnboardingComplete: createEventHandler(
      onWorkingCapitalOnboardingComplete,
      MoniteEventTypes.WORKING_CAPITAL_ONBOARDING_COMPLETED,
      (id) => ({ id })
    ),
  } as ComponentSettings['onboarding'];
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
    onboarding: enhanceOnboardingSettings(settings.onboarding),
  };
}

/**
 * Adds an event listener for a specific Monite event type
 *
 * @param eventType The type of event to listen for
 * @param callback The callback function to execute when the event occurs
 * @returns A cleanup function to remove the event listener
 */
export function addMoniteEventListener<T extends EventPayload>(
  eventType: MoniteEventTypes,
  callback: (event: CustomEvent<MoniteEvent<T>>) => void,
  target: Element | Document = getMoniteAppEventTarget()
): () => void {
  const eventName = `${MONITE_EVENT_PREFIX}:${eventType}`;
  const wrappedCallback = callback as EventListener;

  target.addEventListener(eventName, wrappedCallback);

  return () => {
    target.removeEventListener(eventName, wrappedCallback);
  };
}

/**
 * Helper function to get the Monite app element from the document
 *
 * @returns The Monite app element or null if not found
 */
export function getMoniteAppElement(): Element | null {
  return document.querySelector(MONITE_APP_ELEMENT_NAME);
}

/**
 * Gets the most appropriate target for Monite events.
 * This function tries to find the Monite app element in the DOM.
 * If found and properly initialized, it returns that element.
 * Otherwise, it falls back to the document object.
 *
 * Note: The current implementation only supports predefined target elements
 * (the Monite app element and document). This is because the component settings
 * callbacks and event listener logic are intentionally decoupled for better
 * separation of concerns. Supporting custom event targets would require
 * significant changes to how settings work throughout the SDK.
 *
 * Future versions may introduce support for custom event targets, but this would
 * involve architectural changes to maintain consistency between component settings
 * and the event system.
 *
 * @returns The most appropriate target for Monite events
 */
export function getMoniteAppEventTarget(): Element | Document {
  const moniteApp = getMoniteAppElement();
  if (moniteApp && moniteApp.hasAttribute('component')) {
    return moniteApp;
  }

  return document;
}

function generateEventId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export { generateEventId };
