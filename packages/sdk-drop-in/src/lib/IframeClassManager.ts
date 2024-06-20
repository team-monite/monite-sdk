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
    this.channel.port1.postMessage({ type, payload: JSON.stringify(payload) });
  }
}

interface IframeAppState {
  theme: string | null;
  locale: string | null;
}

class IframeAppManager {
  state: IframeAppState;
  fetchTokenCallback: (() => Promise<string>) | null;
  port?: MessagePort;
  listeners: { [key: string]: (payload: string) => void };

  constructor() {
    this.state = {
      theme: null,
      locale: null,
    };
    this.fetchTokenCallback = null;
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

  on(event: string, callback: (payload: string) => void) {
    this.listeners[event] = (payload: string | undefined) => {
      const serializedPayload = JSON.stringify(payload);
      callback(serializedPayload);
    };
  }

  fetchToken(): Promise<string> {
    return new Promise((resolve) => {
      if (this.fetchTokenCallback) {
        this.fetchTokenCallback().then(resolve);
      }
      this.port?.postMessage({ type: 'fetch-token' });
    });
  }

  connectWithRetry(retryCount = 0) {
    if (this.port) {
      this.port.postMessage({ type: 'connect' });

      this.port.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type in this.listeners) {
          this.listeners[type](payload);
        }
      };
    } else if (retryCount < 5) {
      setTimeout(() => this.connectWithRetry(retryCount + 1), 1000);
    }
  }
}

export { IframeManager, IframeAppManager };
