class IframeManager {
  iframe: HTMLIFrameElement | null;
  channel: MessageChannel;

  constructor(iframeId: string) {
    this.iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    this.channel = new MessageChannel();
    this.init();
  }

  registerChannel(type: string, payload: string | undefined) {
    this.sendMessageToIframe(type, JSON.stringify(payload));
  }

  init() {
    if (this.iframe) {
      this.iframe.addEventListener('load', () => {
        this.iframe?.contentWindow?.postMessage({ type: 'connect' }, '*', [
          this.channel.port2,
        ]);

        this.channel.port1.onmessage = (event) => {
          const { type, payload } = event.data;
          payload && this.sendMessageToIframe(type, payload);
        };
      });
    }
  }

  sendMessageToIframe(type: string, payload: string | undefined) {
    try {
      this.channel.port1.postMessage({
        type,
        payload: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Error sending message to iframe:', error);
    }
  }
}

interface IframeAppState {
  [key: string]: string | null;
}

class IframeAppManager {
  state: IframeAppState;
  port?: MessagePort;
  listeners: { [key: string]: (payload: string) => void };

  constructor() {
    this.state = {};
    this.listeners = {};
    this.preInit();
    this.init();
  }

  preInit() {
    window.parent.postMessage({ type: 'readyToConnect' }, '*');
  }

  init() {
    window.addEventListener('message', (event) => this.handleMessage(event));
  }

  handleMessage(event: MessageEvent) {
    if (event.data.type === 'connect') {
      this.port = event.ports[0];
      this.port.onmessage = ({ data }) => {
        if (data.type in this.listeners) {
          this.listeners[data.type](data.payload);
        }
      };
    }
  }

  on(event: string, callback: (payload: object) => void) {
    this.listeners[event] = (payload: string) => {
      const deserializedPayload = JSON.parse(payload);
      callback(deserializedPayload);
    };
  }

  connectWithRetry(retryCount = 0) {
    if (this.port) {
      try {
        this.port.postMessage({ type: 'connect' });

        this.port.onmessage = (event) => {
          const { type, payload } = event.data;
          if (type in this.listeners) {
            this.listeners[type](payload);
          }
        };
      } catch (error) {
        console.error('Error during port message handling:', error);
      }
    } else if (retryCount < 5) {
      setTimeout(() => this.connectWithRetry(retryCount + 1), 1000);
    }
  }

  handleConnectMessage(event: MessageEvent) {
    if (event.data.type !== 'connect') return;

    this.port!.onmessage = ({ data }) => {
      if (data.type in this.listeners) {
        this.listeners[data.type](data.payload);
      }
    };
  }
}

export { IframeManager, IframeAppManager };
