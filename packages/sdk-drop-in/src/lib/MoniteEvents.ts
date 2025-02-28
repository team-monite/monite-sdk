/**
 * Monite Events System
 *
 * This module provides a centralized way to define, emit, and handle Monite events.
 */
import { APISchema } from '@monite/sdk-react';

type ReceivableResponseType =
  APISchema.components['schemas']['ReceivableResponse'];

type PaymentIntentResponseType =
  APISchema.components['schemas']['PaymentIntentResponse'];

type CounterpartResponseType =
  APISchema.components['schemas']['CounterpartResponse'];

export enum MoniteEventTypes {
  INVOICE_CREATED = 'invoice.created',
  INVOICE_UPDATED = 'invoice.updated',
  INVOICE_DELETED = 'invoice.deleted',
  PAYMENT_RECEIVED = 'payment.received',
  COUNTERPART_CREATED = 'counterpart.created',
  COUNTERPART_UPDATED = 'counterpart.updated',
  COUNTERPART_DELETED = 'counterpart.deleted',
  PAYABLE_SAVED = 'payable.saved',
  PAYABLE_CANCELED = 'payable.canceled',
  PAYABLE_SUBMITTED = 'payable.submitted',
  PAYABLE_REJECTED = 'payable.rejected',
  PAYABLE_APPROVED = 'payable.approved',
  PAYABLE_REOPENED = 'payable.reopened',
  PAYABLE_DELETED = 'payable.deleted',
  PAYABLE_PAY = 'payable.pay',
  PAYABLE_PAY_US = 'payable.pay_us',
}

export interface BaseEventPayload {
  id: string;
}

export type InvoiceEventPayload = BaseEventPayload & {
  invoice?: ReceivableResponseType;
};

export type PaymentEventPayload = BaseEventPayload & {
  payment?: PaymentIntentResponseType;
};

export type CounterpartEventPayload = BaseEventPayload & {
  counterpart?: CounterpartResponseType;
};

export type EventPayload =
  | InvoiceEventPayload
  | PaymentEventPayload
  | CounterpartEventPayload;

export interface MoniteEvent<T extends EventPayload = EventPayload> {
  id: string;
  type: MoniteEventTypes;
  payload: T;
}

export interface EventConfig {
  enabled: boolean;
}

export interface ExtendedComponentSettings {
  events?: EventConfig;
  receivables?: ReceivablesSettings;
  payables?: PayablesSettings;
  counterparts?: CounterpartsSettings;
}

export interface ReceivablesSettings {
  onCreate?: (receivableId: string, invoice?: ReceivableResponseType) => void;
  onUpdate?: (receivableId: string, invoice?: ReceivableResponseType) => void;
  onDelete?: (receivableId: string) => void;
}

export interface PayablesSettings {
  onSaved?: (payableId: string, payable?: PaymentIntentResponseType) => void;
  onCanceled?: (payableId: string) => void;
  onSubmitted?: (payableId: string) => void;
  onRejected?: (payableId: string) => void;
  onApproved?: (payableId: string) => void;
  onReopened?: (payableId: string) => void;
  onDeleted?: (payableId: string) => void;
  onPay?: (payableId: string) => void;
  onPayUS?: (payableId: string) => void;
}

export interface CounterpartsSettings {
  onCreate?: (
    counterpartId: string,
    counterpart?: CounterpartResponseType
  ) => void;
  onUpdate?: (
    counterpartId: string,
    counterpart?: CounterpartResponseType
  ) => void;
  onDelete?: (counterpartId: string) => void;
}

export type EntityHandler<D = unknown> = (id: string, data?: D) => void;
export type EventPayloadCreator<T extends BaseEventPayload, D = unknown> = (
  id: string,
  data?: D
) => T;

/**
 * Generates a unique event ID using crypto.randomUUID() if available,
 * otherwise falls back to a timestamp-based unique ID
 */
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
 * Emits a Monite event as a custom DOM event
 */
export function emitMoniteEvent<T extends EventPayload>(
  type: MoniteEventTypes,
  payload: T,
  target?: Element
): boolean {
  console.log(`[MoniteEvents] Starting event emission for type ${type}`);
  console.log('[MoniteEvents] Event payload:', payload);

  const eventId = generateEventId();
  console.log('[MoniteEvents] Generated event ID:', eventId);
  console.log('[MoniteEvents] Target element:', target || 'document');

  const eventDetail = {
    id: eventId,
    type,
    payload,
  };

  const typeSpecificEvent = new CustomEvent(`monite.event:${type}`, {
    detail: eventDetail,
    bubbles: true,
    composed: true,
  });

  const targetElement = target || document;
  return targetElement.dispatchEvent(typeSpecificEvent);
}

/**
 * Creates a wrapped handler that calls the original handler and emits an event
 *
 * @param originalHandler The original handler function to wrap
 * @param eventType The event type to emit
 * @param createPayload Function to create the event payload
 * @param logMessage Message to log when the event is triggered
 * @returns A wrapped handler function
 */
export function createEventHandler<T extends BaseEventPayload, D = unknown>(
  originalHandler: EntityHandler<D> | undefined,
  eventType: MoniteEventTypes,
  createPayload: EventPayloadCreator<T, D>,
  logMessage: string
): EntityHandler<D> {
  console.log(
    '[createEventHandler] Creating handler for event type:',
    eventType
  );
  console.log('[createEventHandler] Original handler:', originalHandler);

  return (id: string, data?: D) => {
    console.log(`[createEventHandler] Handler called for ${eventType}`);
    console.log('[createEventHandler] ID:', id);
    console.log('[createEventHandler] Data:', data);
    console.log(`[createEventHandler] ${logMessage} with ID:`, id);

    const payload = createPayload(id, data);
    console.log(
      `[createEventHandler] Created payload for ${eventType}:`,
      payload
    );

    const emitted = emitMoniteEvent(eventType, payload);
    console.log(
      `[createEventHandler] Event ${eventType} emission result:`,
      emitted
    );

    if (originalHandler) {
      console.log(
        '[createEventHandler] Calling original handler after event emission'
      );
      originalHandler(id, data);
    }
  };
}

/**
 * Enhances receivables settings with event handlers
 *
 * @param settings The original receivables settings
 * @returns Enhanced receivables settings with event handlers
 */
export function enhanceReceivablesSettings(
  settings: ReceivablesSettings
): ReceivablesSettings {
  console.log(
    '[enhanceReceivablesSettings] Starting enhancement with settings:',
    settings
  );

  const enhanced = { ...settings };

  enhanced.onCreate = createEventHandler<
    InvoiceEventPayload,
    ReceivableResponseType
  >(
    settings.onCreate,
    MoniteEventTypes.INVOICE_CREATED,
    (id, invoice) => ({ id, invoice }),
    'Invoice created:'
  );

  enhanced.onUpdate = createEventHandler<
    InvoiceEventPayload,
    ReceivableResponseType
  >(
    settings.onUpdate,
    MoniteEventTypes.INVOICE_UPDATED,
    (id, invoice) => ({ id, invoice }),
    'Invoice updated:'
  );

  enhanced.onDelete = createEventHandler<InvoiceEventPayload>(
    settings.onDelete,
    MoniteEventTypes.INVOICE_DELETED,
    (id) => ({ id }),
    'Invoice deleted:'
  );

  return enhanced;
}

/**
 * Enhances payables settings with event handlers
 *
 * @param settings The original payables settings
 * @returns Enhanced payables settings with event handlers
 */
export function enhancePayablesSettings(
  settings: PayablesSettings
): PayablesSettings {
  console.log(
    '[enhancePayablesSettings] Starting enhancement with settings:',
    settings
  );
  const enhanced = { ...settings };

  enhanced.onSaved = createEventHandler<
    PaymentEventPayload,
    PaymentIntentResponseType
  >(
    settings.onSaved,
    MoniteEventTypes.PAYABLE_SAVED,
    (id, payable) => ({ id, payment: payable }),
    'Payable saved:'
  );

  enhanced.onCanceled = createEventHandler<PaymentEventPayload>(
    settings.onCanceled,
    MoniteEventTypes.PAYABLE_CANCELED,
    (id) => ({ id }),
    'Payable canceled:'
  );

  enhanced.onSubmitted = createEventHandler<PaymentEventPayload>(
    settings.onSubmitted,
    MoniteEventTypes.PAYABLE_SUBMITTED,
    (id) => ({ id }),
    'Payable submitted:'
  );

  enhanced.onRejected = createEventHandler<PaymentEventPayload>(
    settings.onRejected,
    MoniteEventTypes.PAYABLE_REJECTED,
    (id) => ({ id }),
    'Payable rejected:'
  );

  enhanced.onApproved = createEventHandler<PaymentEventPayload>(
    settings.onApproved,
    MoniteEventTypes.PAYABLE_APPROVED,
    (id) => ({ id }),
    'Payable approved:'
  );

  enhanced.onReopened = createEventHandler<PaymentEventPayload>(
    settings.onReopened,
    MoniteEventTypes.PAYABLE_REOPENED,
    (id) => ({ id }),
    'Payable reopened:'
  );

  enhanced.onDeleted = createEventHandler<PaymentEventPayload>(
    settings.onDeleted,
    MoniteEventTypes.PAYABLE_DELETED,
    (id) => ({ id }),
    'Payable deleted:'
  );

  enhanced.onPay = createEventHandler<PaymentEventPayload>(
    settings.onPay,
    MoniteEventTypes.PAYABLE_PAY,
    (id) => ({ id }),
    'Payable pay:'
  );

  enhanced.onPayUS = createEventHandler<PaymentEventPayload>(
    settings.onPayUS,
    MoniteEventTypes.PAYABLE_PAY_US,
    (id) => ({ id }),
    'Payable pay US:'
  );

  return enhanced;
}

/**
 * Enhances counterparts settings with event handlers
 *
 * @param settings The original counterparts settings
 * @returns Enhanced counterparts settings with event handlers
 */
export function enhanceCounterpartsSettings(
  settings: CounterpartsSettings
): CounterpartsSettings {
  const enhanced = { ...settings };

  enhanced.onCreate = createEventHandler<
    CounterpartEventPayload,
    CounterpartResponseType
  >(
    settings.onCreate,
    MoniteEventTypes.COUNTERPART_CREATED,
    (id, counterpart) => ({ id, counterpart }),
    'Counterpart created:'
  );

  enhanced.onUpdate = createEventHandler<
    CounterpartEventPayload,
    CounterpartResponseType
  >(
    settings.onUpdate,
    MoniteEventTypes.COUNTERPART_UPDATED,
    (id, counterpart) => ({ id, counterpart }),
    'Counterpart updated:'
  );

  enhanced.onDelete = createEventHandler<CounterpartEventPayload>(
    settings.onDelete,
    MoniteEventTypes.COUNTERPART_DELETED,
    (id) => ({ id }),
    'Counterpart deleted:'
  );

  return enhanced;
}

/**
 * Enhances component settings with event handlers
 *
 * @param settings The original component settings
 * @returns Enhanced component settings with event handlers
 */
export function enhanceComponentSettings(
  settings: ExtendedComponentSettings
): ExtendedComponentSettings {
  console.log('[enhanceComponentSettings] ========== START ==========');
  console.log('[enhanceComponentSettings] Original settings:', settings);

  if (!settings) {
    console.log(
      '[enhanceComponentSettings] No settings provided, returning null'
    );
    console.log('[enhanceComponentSettings] ========== END ==========');
    return settings;
  }

  const { events, ...rest } = settings;
  const isEnabled = events?.enabled ?? false;

  if (!isEnabled) {
    console.log('[enhanceComponentSettings] Events are disabled in settings');
    console.log('[enhanceComponentSettings] ========== END ==========');
    return settings;
  }

  console.log('[enhanceComponentSettings] Events are enabled');

  // Create default settings with empty handlers to ensure events are emitted
  const defaultHandlers = {
    receivables: {
      onCreate: () => {
        console.log(
          '[enhanceComponentSettings] Default onCreate handler called'
        );
      },
      onUpdate: () => {
        console.log(
          '[enhanceComponentSettings] Default onUpdate handler called'
        );
      },
      onDelete: () => {
        console.log(
          '[enhanceComponentSettings] Default onDelete handler called'
        );
      },
    },
    payables: {
      onSaved: () => {},
      onCanceled: () => {},
      onSubmitted: () => {},
      onRejected: () => {},
      onApproved: () => {},
      onReopened: () => {},
      onDeleted: () => {},
      onPay: () => {},
      onPayUS: () => {},
    },
    counterparts: {
      onCreate: () => {},
      onUpdate: () => {},
      onDelete: () => {},
    },
  };

  console.log('[enhanceComponentSettings] Created default handlers');

  const mergedSettings = {
    ...rest,
    events,
    receivables: {
      ...(rest.receivables || {}),
      ...defaultHandlers.receivables,
      ...(settings.receivables || {}),
    },
    payables: {
      ...(rest.payables || {}),
      ...defaultHandlers.payables,
      ...(settings.payables || {}),
    },
    counterparts: {
      ...(rest.counterparts || {}),
      ...defaultHandlers.counterparts,
      ...(settings.counterparts || {}),
    },
  };

  console.log(
    '[enhanceComponentSettings] Merged settings with defaults:',
    mergedSettings
  );

  const enhancedSettings = {
    ...mergedSettings,
    receivables: enhanceReceivablesSettings(mergedSettings.receivables),
    payables: enhancePayablesSettings(mergedSettings.payables),
    counterparts: enhanceCounterpartsSettings(mergedSettings.counterparts),
  };

  console.log(
    '[enhanceComponentSettings] Final enhanced settings:',
    enhancedSettings
  );
  console.log('[enhanceComponentSettings] ========== END ==========');
  return enhancedSettings;
}

/**
 * Checks if any events are enabled in the component settings
 * This is a quick check to determine if event handling should be activated at all
 *
 * @param settings The component settings to check
 * @returns boolean indicating if any events are enabled
 */
export function areEventsEnabled(
  settings?: ExtendedComponentSettings
): boolean {
  console.log('[areEventsEnabled] Checking settings:', settings);

  if (!settings) {
    console.log('[areEventsEnabled] No settings provided, returning false');
    return false;
  }

  if (settings.events?.enabled === true) {
    console.log('[areEventsEnabled] Events explicitly enabled globally');
    return true;
  }

  return false;
}
