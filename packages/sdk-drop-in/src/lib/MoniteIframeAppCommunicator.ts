export class MoniteIframeAppCommunicator {
  private readonly targetWindow?: Window;
  private readonly isHost: boolean;
  private readonly listeners = new Map<
    string,
    (payload: ListenerPayload) => void
  >();
  private readonly slots = new Map<
    string,
    { payload: PayloadSlot; abortController?: AbortController }
  >();

  private connectionToHostRetryInterval?: number;
  private slotQueue = new Set<string>();
  private connected = false;

  static allowedSlots = ['locale', 'theme', 'fetch-token'];

  constructor(iframeElement: HTMLIFrameElement | Window) {
    if (iframeElement instanceof HTMLIFrameElement) {
      this.isHost = true;
      this.targetWindow = iframeElement.contentWindow ?? undefined;
    } else {
      this.isHost = false;
      this.targetWindow = iframeElement;
    }
  }

  public connect() {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return void console.warn('Cannot connect in non-browser environment');

    this.disconnect();

    if (!this.targetWindow)
      throw new Error('[monite-iframe-app]: Target window is not set');

    window.addEventListener('message', this.onWindowMessage);

    if (!this.isHost) {
      this.connectionToHostRetryInterval = setInterval(() => {
        if (!this.targetWindow)
          throw new Error('[monite-iframe-app]: Target window is not set');
        this.connect();
      }, 200) as unknown as number;

      this.targetWindow?.postMessage({ type: 'monite:init_host' }, '*');
    }
  }

  private onWindowMessage = (event: MessageEvent) => {
    if (!event.source || !('postMessage' in event.source))
      throw new Error('[monite-iframe-app]: Invalid source');

    const data = event.data;

    assertData(data);

    if (data.type === 'monite:init_host') {
      this.targetWindow?.postMessage({ type: 'monite:init_iframe' }, '*');
      this.connected = true;
    } else if (data.type === 'monite:init_iframe') {
      this.connected = true;
      clearInterval(this.connectionToHostRetryInterval);
      this.runSlotQueue();
    }

    if (this.slots.has(data.type)) {
      this.queueSlot(data.type);
    }

    if (MoniteIframeAppCommunicator.allowedSlots.includes(data.type))
      this.listeners.get(data.type)?.(data.payload);

    function assertData(
      data: unknown
    ): asserts data is { type: string; payload?: ListenerPayload } {
      if (typeof data !== 'object' || data === null) {
        throw new Error(
          `[monite-iframe-app]: Invalid message data type: '${typeof data}'`
        );
      }
      if (typeof (data as { type: unknown }).type !== 'string') {
        if ((data as { type: unknown }).type === undefined)
          throw new Error('[monite-iframe-app]: Message `type` is not defined');
        throw new Error('[monite-iframe-app]: Unsupported message `type`');
      }
    }
  };

  public disconnect() {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return void console.warn('Cannot disconnect in non-browser environment');

    clearInterval(this.connectionToHostRetryInterval);
    window.removeEventListener('message', this.onWindowMessage);
    Array.from(this.slots.values()).forEach(
      ({ abortController }) => void abortController?.abort()
    );
    this.connected = false;
  }

  public mountSlot(slotName: string, data: PayloadSlot) {
    this.unmountSlot(slotName);

    if (data !== undefined) {
      this.slots.set(slotName, {
        ...this.slots.get(slotName),
        payload: data,
      });

      this.queueSlot(slotName);
    }
  }

  public pingSlot(slotName: string) {
    this.queueSlot(slotName);
  }

  public unmountSlot(slotName: string) {
    this.slots.get(slotName)?.abortController?.abort();
    this.slots.delete(slotName);
  }

  public on(eventName: string, listener: (payload: unknown) => void) {
    this.listeners.set(eventName, listener);
  }

  public off(eventName: string) {
    this.listeners.delete(eventName);
  }

  private queueSlot(slotName: string) {
    this.slotQueue.add(slotName);
    this.runSlotQueue();
  }

  private runSlotQueue() {
    if (!this.connected)
      return console.warn(
        `Not connected to ${
          this.isHost ? '"iframe"' : '"host"'
        } [Monite Iframe App]`
      );

    this.slotQueue.forEach((slotName) => void this.emitSlot(slotName));
    this.slotQueue.clear();
  }

  private emitSlot(slotName: string) {
    if (!this.connected)
      throw new Error('[monite-iframe-app]: Send port is not set');

    const slot = this.slots.get(slotName);

    if (slot) {
      slot.abortController?.abort();
    } else {
      // send request for slot payload
      // if slot is not mounted (pingSlot)
      // todo:: refactor to specific message type
      return void this.targetWindow?.postMessage(
        {
          type: slotName,
          payload: null,
        },
        '*'
      );
    }

    const payloadSlot = slot.payload;

    if (typeof payloadSlot === 'function') {
      const abortController = new AbortController();
      this.slots.set(slotName, {
        payload: payloadSlot,
        abortController,
      });
      payloadSlot({ signal: abortController.signal }).then(
        (resultPayload: unknown) => {
          assertSlotPayload(resultPayload);
          this.targetWindow?.postMessage(
            {
              type: slotName,
              payload: resultPayload,
            },
            '*'
          );
        }
      );
    } else {
      assertSlotPayload(payloadSlot);
      this.targetWindow?.postMessage(
        {
          type: slotName,
          payload: payloadSlot,
        },
        '*'
      );
    }

    function assertSlotPayload(
      rawPayload: unknown
    ): asserts rawPayload is PayloadSlot {
      if (typeof rawPayload !== 'undefined') return;
      throw new Error(
        `[monite-iframe-app]: Slot '${slotName}' payload must be a function or a primitive value. Got: ${typeof rawPayload}`
      );
    }
  }
}

type ListenerPayload =
  | string
  | number
  | boolean
  | null
  | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Array<any>;

type PayloadSlot =
  | ListenerPayload
  | {
      (props: { signal: AbortSignal }): Promise<unknown>;
    };
