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
  types?: string[];
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
  console.log('[MoniteEvents] Target element:', target || 'window');

  const eventId = generateEventId();
  console.log('[MoniteEvents] Generated event ID:', eventId);

  const event = new CustomEvent<MoniteEvent>('monite:event', {
    detail: {
      id: eventId,
      type,
      payload,
    },
    bubbles: true,
    cancelable: true,
  });

  console.log('[MoniteEvents] Created CustomEvent:', event);
  console.log('[MoniteEvents] Event detail:', event.detail);

  const result = target
    ? target.dispatchEvent(event)
    : window.dispatchEvent(event);
  console.log(`[MoniteEvents] Event dispatch result: ${result}`);

  return result;
}

/**
 * Adds a listener for Monite events
 */
export function addMoniteEventListener(
  handler: (event: CustomEvent<MoniteEvent>) => void
): () => void {
  const eventHandler = (event: Event) => {
    if (
      event instanceof CustomEvent &&
      event.type === 'monite:event' &&
      event.detail
    ) {
      handler(event as CustomEvent<MoniteEvent>);
    }
  };

  window.addEventListener('monite:event', eventHandler);
  return () => window.removeEventListener('monite:event', eventHandler);
}

/**
 * Checks if an event type is enabled based on the configuration
 *
 * @param type The event type to check
 * @param eventTypes Optional array of specific event types that are enabled
 * @returns boolean indicating if the event type is enabled
 */
export function isEventTypeEnabled(
  type: MoniteEventTypes,
  eventTypes?: string[]
): boolean {
  if (!eventTypes || eventTypes.length === 0) {
    return true;
  }

  return eventTypes.includes(type);
}

/**
 * Creates a wrapped handler that calls the original handler and emits an event
 *
 * @param originalHandler The original handler function to wrap
 * @param eventType The event type to emit
 * @param createPayload Function to create the event payload
 * @param logMessage Message to log when the event is triggered
 * @param isEnabled Function to check if the event type is enabled
 * @returns A wrapped handler function
 */
export function createEventHandler<T extends BaseEventPayload, D = unknown>(
  originalHandler: EntityHandler<D> | undefined,
  eventType: MoniteEventTypes,
  createPayload: EventPayloadCreator<T, D>,
  logMessage: string,
  isEnabled: boolean
): EntityHandler<D> {
  console.log(
    '[createEventHandler] Creating handler for event type:',
    eventType
  );
  console.log('[createEventHandler] Original handler:', originalHandler);
  console.log('[createEventHandler] Is enabled:', isEnabled);

  return (id: string, data?: D) => {
    console.log(`[createEventHandler] Handler called for ${eventType}`);
    console.log('[createEventHandler] ID:', id);
    console.log('[createEventHandler] Data:', data);
    console.log(`[createEventHandler] ${logMessage} with ID:`, id);

    if (!isEnabled) {
      console.log(
        `[createEventHandler] Events are disabled for type: ${eventType}`
      );
      if (originalHandler) {
        console.log('[createEventHandler] Calling original handler only');
        originalHandler(id, data);
      }
      return;
    }

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
 * @param enabledEventTypes Array of enabled event types
 * @returns Enhanced receivables settings with event handlers
 */
export function enhanceReceivablesSettings(
  settings: ReceivablesSettings,
  enabledEventTypes?: string[]
): ReceivablesSettings {
  console.log(
    '[enhanceReceivablesSettings] Starting enhancement with settings:',
    settings
  );
  console.log(
    '[enhanceReceivablesSettings] Enabled event types:',
    enabledEventTypes
  );

  const enhanced = { ...settings };

  const isCreateEnabled = isEventTypeEnabled(
    MoniteEventTypes.INVOICE_CREATED,
    enabledEventTypes
  );
  enhanced.onCreate = createEventHandler<
    InvoiceEventPayload,
    ReceivableResponseType
  >(
    settings.onCreate,
    MoniteEventTypes.INVOICE_CREATED,
    (id, invoice) => ({ id, invoice }),
    'Invoice created:',
    isCreateEnabled
  );

  const isUpdateEnabled = isEventTypeEnabled(
    MoniteEventTypes.INVOICE_UPDATED,
    enabledEventTypes
  );
  enhanced.onUpdate = createEventHandler<
    InvoiceEventPayload,
    ReceivableResponseType
  >(
    settings.onUpdate,
    MoniteEventTypes.INVOICE_UPDATED,
    (id, invoice) => ({ id, invoice }),
    'Invoice updated:',
    isUpdateEnabled
  );

  const isDeleteEnabled = isEventTypeEnabled(
    MoniteEventTypes.INVOICE_DELETED,
    enabledEventTypes
  );
  enhanced.onDelete = createEventHandler<InvoiceEventPayload>(
    settings.onDelete,
    MoniteEventTypes.INVOICE_DELETED,
    (id) => ({ id }),
    'Invoice deleted:',
    isDeleteEnabled
  );

  return enhanced;
}

/**
 * Enhances payables settings with event handlers
 *
 * @param settings The original payables settings
 * @param enabledEventTypes Array of enabled event types
 * @returns Enhanced payables settings with event handlers
 */
export function enhancePayablesSettings(
  settings: PayablesSettings,
  enabledEventTypes?: string[]
): PayablesSettings {
  console.log(
    '[enhancePayablesSettings] Starting enhancement with settings:',
    settings
  );
  const enhanced = { ...settings };

  const isSaveEnabled = isEventTypeEnabled(
    MoniteEventTypes.PAYABLE_SAVED,
    enabledEventTypes
  );
  enhanced.onSaved = createEventHandler<
    PaymentEventPayload,
    PaymentIntentResponseType
  >(
    settings.onSaved,
    MoniteEventTypes.PAYABLE_SAVED,
    (id, payable) => ({ id, payment: payable }),
    'Payable saved:',
    isSaveEnabled
  );

  const isCancelEnabled = isEventTypeEnabled(
    MoniteEventTypes.PAYABLE_CANCELED,
    enabledEventTypes
  );
  enhanced.onCanceled = createEventHandler<PaymentEventPayload>(
    settings.onCanceled,
    MoniteEventTypes.PAYABLE_CANCELED,
    (id) => ({ id }),
    'Payable canceled:',
    isCancelEnabled
  );

  const isSubmitEnabled = isEventTypeEnabled(
    MoniteEventTypes.PAYABLE_SUBMITTED,
    enabledEventTypes
  );
  enhanced.onSubmitted = createEventHandler<PaymentEventPayload>(
    settings.onSubmitted,
    MoniteEventTypes.PAYABLE_SUBMITTED,
    (id) => ({ id }),
    'Payable submitted:',
    isSubmitEnabled
  );

  const isRejectEnabled = isEventTypeEnabled(
    MoniteEventTypes.PAYABLE_REJECTED,
    enabledEventTypes
  );
  enhanced.onRejected = createEventHandler<PaymentEventPayload>(
    settings.onRejected,
    MoniteEventTypes.PAYABLE_REJECTED,
    (id) => ({ id }),
    'Payable rejected:',
    isRejectEnabled
  );

  const isApproveEnabled = isEventTypeEnabled(
    MoniteEventTypes.PAYABLE_APPROVED,
    enabledEventTypes
  );
  enhanced.onApproved = createEventHandler<PaymentEventPayload>(
    settings.onApproved,
    MoniteEventTypes.PAYABLE_APPROVED,
    (id) => ({ id }),
    'Payable approved:',
    isApproveEnabled
  );

  const isReopenEnabled = isEventTypeEnabled(
    MoniteEventTypes.PAYABLE_REOPENED,
    enabledEventTypes
  );
  enhanced.onReopened = createEventHandler<PaymentEventPayload>(
    settings.onReopened,
    MoniteEventTypes.PAYABLE_REOPENED,
    (id) => ({ id }),
    'Payable reopened:',
    isReopenEnabled
  );

  const isDeleteEnabled = isEventTypeEnabled(
    MoniteEventTypes.PAYABLE_DELETED,
    enabledEventTypes
  );
  enhanced.onDeleted = createEventHandler<PaymentEventPayload>(
    settings.onDeleted,
    MoniteEventTypes.PAYABLE_DELETED,
    (id) => ({ id }),
    'Payable deleted:',
    isDeleteEnabled
  );

  const isPayEnabled = isEventTypeEnabled(
    MoniteEventTypes.PAYABLE_PAY,
    enabledEventTypes
  );
  enhanced.onPay = createEventHandler<PaymentEventPayload>(
    settings.onPay,
    MoniteEventTypes.PAYABLE_PAY,
    (id) => ({ id }),
    'Payable pay:',
    isPayEnabled
  );

  const isPayUSEnabled = isEventTypeEnabled(
    MoniteEventTypes.PAYABLE_PAY_US,
    enabledEventTypes
  );
  enhanced.onPayUS = createEventHandler<PaymentEventPayload>(
    settings.onPayUS,
    MoniteEventTypes.PAYABLE_PAY_US,
    (id) => ({ id }),
    'Payable pay US:',
    isPayUSEnabled
  );

  return enhanced;
}

/**
 * Enhances counterparts settings with event handlers
 *
 * @param settings The original counterparts settings
 * @param enabledEventTypes Array of enabled event types
 * @returns Enhanced counterparts settings with event handlers
 */
export function enhanceCounterpartsSettings(
  settings: CounterpartsSettings,
  enabledEventTypes?: string[]
): CounterpartsSettings {
  const enhanced = { ...settings };

  const isCreateEnabled = isEventTypeEnabled(
    MoniteEventTypes.COUNTERPART_CREATED,
    enabledEventTypes
  );
  enhanced.onCreate = createEventHandler<
    CounterpartEventPayload,
    CounterpartResponseType
  >(
    settings.onCreate,
    MoniteEventTypes.COUNTERPART_CREATED,
    (id, counterpart) => ({ id, counterpart }),
    'Counterpart created:',
    isCreateEnabled
  );

  const isUpdateEnabled = isEventTypeEnabled(
    MoniteEventTypes.COUNTERPART_UPDATED,
    enabledEventTypes
  );
  enhanced.onUpdate = createEventHandler<
    CounterpartEventPayload,
    CounterpartResponseType
  >(
    settings.onUpdate,
    MoniteEventTypes.COUNTERPART_UPDATED,
    (id, counterpart) => ({ id, counterpart }),
    'Counterpart updated:',
    isUpdateEnabled
  );

  const isDeleteEnabled = isEventTypeEnabled(
    MoniteEventTypes.COUNTERPART_DELETED,
    enabledEventTypes
  );
  enhanced.onDelete = createEventHandler<CounterpartEventPayload>(
    settings.onDelete,
    MoniteEventTypes.COUNTERPART_DELETED,
    (id) => ({ id }),
    'Counterpart deleted:',
    isDeleteEnabled
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

  if (!events?.enabled) {
    console.log('[enhanceComponentSettings] Events are disabled in settings');
    console.log('[enhanceComponentSettings] ========== END ==========');
    return settings;
  }

  console.log('[enhanceComponentSettings] Events are enabled');
  console.log('[enhanceComponentSettings] Event types:', events.types);

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
    receivables: enhanceReceivablesSettings(
      mergedSettings.receivables,
      events.types
    ),
    payables: enhancePayablesSettings(mergedSettings.payables, events.types),
    counterparts: enhanceCounterpartsSettings(
      mergedSettings.counterparts,
      events.types
    ),
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

/**
 * Checks if a specific event type is enabled for a component
 *
 * @param eventType The event type to check
 * @param settings The component settings
 * @returns boolean indicating if the specific event is enabled
 */
export function isSpecificEventEnabled(
  eventType: MoniteEventTypes,
  settings?: ExtendedComponentSettings
): boolean {
  console.log('[isSpecificEventEnabled] Checking event type:', eventType);
  console.log('[isSpecificEventEnabled] Settings:', settings);

  if (!settings) {
    console.log(
      '[isSpecificEventEnabled] No settings provided, returning false'
    );
    return false;
  }

  if (settings.events?.enabled === false) {
    console.log('[isSpecificEventEnabled] Events globally disabled');
    return false;
  }

  if (
    settings.events?.types &&
    !isEventTypeEnabled(eventType, settings.events.types)
  ) {
    console.log(
      '[isSpecificEventEnabled] Event type not in enabled types list'
    );
    return false;
  }

  return true;
}
