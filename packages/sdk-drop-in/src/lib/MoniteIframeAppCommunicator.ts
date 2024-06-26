export class MoniteIframeAppCommunicator {
  private readonly targetWindow?: Window;
  private readonly isHost: boolean;
  private readonly listeners: {
    [event_name: string]: (payload: PayloadSlot) => void;
  } = {};
  private readonly slots: {
    [slotName: string]: {
      payload: PayloadSlot;
      abortController: AbortController | null;
    };
  } = {};

  private connectionToHostRetryInterval?: number;
  private slotQueue = new Set<string>();
  private connected = false;

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
    this.disconnect();

    if (!this.targetWindow) throw new Error('Target window is not set');

    window.addEventListener('message', this.onWindowMessage);

    if (!this.isHost) {
      this.connectionToHostRetryInterval = setInterval(() => {
        if (!this.targetWindow) throw new Error('Target window is not set');
        this.connect();
      }, 200) as unknown as number;

      this.targetWindow?.postMessage({ type: 'monite:init_host' }, '*');
    }
  }

  private onWindowMessage = (event: MessageEvent) => {
    if (!event.source || !('postMessage' in event.source))
      throw new Error('Invalid source');

    const data = event.data;

    if (data.type === 'monite:init_host') {
      this.targetWindow?.postMessage({ type: 'monite:init_iframe' }, '*');
      this.connected = true;
    } else if (data.type === 'monite:init_iframe') {
      this.connected = true;
      clearInterval(this.connectionToHostRetryInterval);
      this.runSlotQueue();
    }

    // todo::add assert for data
    if (data.type in this.slots) {
      this.queueSlot(data.type);
    }

    if (this.listeners[data.type]) {
      this.listeners[data.type](data.payload);
    }
  };

  public disconnect() {
    window.removeEventListener('message', this.onWindowMessage);
    clearInterval(this.connectionToHostRetryInterval);
    Object.values(this.slots).forEach(
      ({ abortController }) => void abortController?.abort()
    );
    this.connected = false;
  }

  public mountSlot(slotName: string, data: PayloadSlot) {
    this.unmountSlot(slotName);

    this.slots[slotName] = {
      ...this.slots[slotName],
      payload: data,
    };

    this.queueSlot(slotName);
  }

  public pingSlot(slotName: string) {
    this.queueSlot(slotName);
  }

  public unmountSlot(slotName: string) {
    this.slots[slotName]?.abortController?.abort();
    delete this.slots[slotName];
  }

  public on(event: string, listener: (payload: unknown) => void) {
    this.listeners[event] = listener;
  }

  public off(event: string) {
    delete this.listeners[event];
  }

  private queueSlot(slotName: string) {
    this.slotQueue.add(slotName);
    this.runSlotQueue();
  }

  private runSlotQueue() {
    if (!this.connected)
      return console.warn(
        `Not connected to ${
          window.parent === window ? '"iframe"' : '"host"'
        } [Monite Iframe App]`
      );
    this.slotQueue.forEach((slotName) => void this.emitSlot(slotName));
    this.slotQueue.clear();
  }

  private emitSlot(slotName: string) {
    if (!this.connected) throw new Error('Send port is not set');

    this.slots[slotName]?.abortController?.abort();

    if (!this.slots[slotName]) {
      return void this.targetWindow?.postMessage(
        {
          type: slotName,
          payload: null,
        },
        '*'
      );
    }

    const payloadSlot = this.slots[slotName].payload;

    if (typeof payloadSlot === 'function') {
      const abortController = new AbortController();
      this.slots[slotName].abortController = abortController;
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
        `Slot '${slotName}' payload must be a function or a primitive value. Got: ${rawPayload}`
      );
    }
  }
}

export type PayloadSlot =
  | string
  | number
  | boolean
  | null
  | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Array<any>
  | {
      (props: { signal: AbortSignal }): Promise<unknown>;
    };
