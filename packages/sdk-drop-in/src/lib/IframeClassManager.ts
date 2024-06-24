class MessageChannelPortManager {
  public port?: MessagePort;
  private listeners: { [event_name: string]: (payload: unknown) => void } = {};
  private slots: {
    [slotName: string]: {
      payload: PayloadSlot;
      abortController: AbortController | null;
    };
  } = {};

  public connect(port: MessagePort) {
    this.port = port;
    this.port.onmessage = ({ data }) => {
      if (data.type in this.slots && typeof data.payload === 'number') {
        if (!this.port) throw new Error('Port is not set');
        this.send(data.type);
      } else if (
        this.listeners[data.type] &&
        typeof data.payload !== 'number'
      ) {
        this.listeners[data.type](data.payload);
      }
    };

    Object.keys(this.slots).forEach((slotName) => {
      this.send(slotName);
    });
  }

  public disconnect() {
    this.port?.close();
    Object.values(this.slots).forEach(
      ({ abortController }) => void abortController?.abort()
    );
  }

  public destroy() {
    this.disconnect();
    this.slots = {};
    this.listeners = {};
  }

  public slot(slotName: string, data: PayloadSlot) {
    this.slots[slotName] = {
      ...this.slots[slotName],
      payload: data,
    };

    this.send(slotName);
  }

  public removeSlot(slotName: string) {
    this.slots[slotName].abortController?.abort();
    delete this.slots[slotName];
  }

  public on(event: string, listener: (payload: unknown) => void) {
    this.listeners[event] = listener;
  }

  public off(event: string) {
    delete this.listeners[event];
  }

  private send(slotName: string) {
    const port = this.port;

    if (!port) return;

    this.slots[slotName].abortController?.abort();

    const payloadSlot = this.slots[slotName].payload;

    if (typeof payloadSlot === 'function') {
      const abortController = new AbortController();
      this.slots[slotName].abortController = abortController;
      payloadSlot({ signal: abortController.signal }).then((resultPayload) => {
        assertSlotPayload(resultPayload);
        port.postMessage({
          type: slotName,
          payload: resultPayload,
        });
      });
    } else {
      assertSlotPayload(payloadSlot);
      port.postMessage({
        type: slotName,
        payload: payloadSlot,
      });
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

export class MoniteIframeAppConsumerMessageChannel {
  private channel: MessageChannel;
  private reconnectPollingInterval?: number;
  private portManager: MessageChannelPortManager;

  constructor(private targetIframe: HTMLIFrameElement) {
    this.channel = new MessageChannel();

    this.portManager = new MessageChannelPortManager();
    this.targetIframe.addEventListener('load', this.onTargetIframeLoad);
  }

  public slot(slotName: string, data: PayloadSlot) {
    this.portManager.slot(slotName, data);
  }

  public removeSlot(slotName: string) {
    this.portManager.removeSlot(slotName);
  }

  public on(event: string, listener: (payload: unknown) => void) {
    this.portManager.on(event, listener);
  }

  public off(event: string) {
    this.portManager.off(event);
  }

  public destroy() {
    clearInterval(this.reconnectPollingInterval);
    this.targetIframe.removeEventListener('load', this.onTargetIframeLoad);
    this.portManager.destroy();
  }

  private onTargetIframeLoad = () => {
    this.targetIframe.removeEventListener('load', this.onTargetIframeLoad);
    window.addEventListener('message', this.onReadyMessage);
  };

  onReadyMessage = (event: MessageEvent) => {
    if (event.data.type !== 'ready') return;
    window?.removeEventListener('message', this.onReadyMessage);
    this.portManager.connect(this.channel.port1);
    this.targetIframe.contentWindow?.postMessage({ type: 'connect' }, '*', [
      this.channel.port2,
    ]);
  };
}

export class MoniteIframeAppMessageChannel {
  private portManager: MessageChannelPortManager;
  private readyPollingInterval?: number;

  constructor(protected targetWindow: Window) {
    this.portManager = new MessageChannelPortManager();

    this.targetWindow.addEventListener('message', this.onTargetWindowMessage);
  }

  private onTargetWindowMessage = (event: MessageEvent) => {
    const communicationPort = event.ports[0];
    if (!communicationPort) return;

    if (event.data.type !== 'connect') return;
    if (this.portManager.port !== communicationPort) {
      this.portManager.disconnect();
      this.portManager.connect(communicationPort);
    }
  };

  public connect = () => {
    const ready = () => {
      this.targetWindow.parent.postMessage({ type: 'ready' }, '*');
    };

    this.readyPollingInterval = setInterval(
      () => void ready(),
      1000
    ) as unknown as number;

    ready();
  };

  public requestSlot(slotName: string) {
    this.portManager.slot(slotName, Date.now());
  }

  public removeSlot(slotName: string) {
    this.portManager.removeSlot(slotName);
  }

  public on(event: string, listener: (payload: unknown) => void) {
    this.portManager.on(event, listener);
  }

  public off(event: string) {
    this.portManager.off(event);
  }

  public destroy() {
    this.targetWindow.removeEventListener(
      'message',
      this.onTargetWindowMessage
    );
    this.portManager.destroy();
  }
}

type PayloadSlot =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | Array<unknown>
  | {
      (props: { signal: AbortSignal }): Promise<unknown>;
    };
