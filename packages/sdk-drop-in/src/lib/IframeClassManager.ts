interface IframeAppState {
  [key: string]: string | null;
}

export class IframeAppManager {
  iframe?: HTMLIFrameElement | null;
  channel: MessageChannel;
  state: IframeAppState;
  port?: MessagePort;
  listeners: { [key: string]: (payload: string) => void };

  constructor(iframeId?: string) {
    if (typeof iframeId === 'string') {
      this.iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    }
    this.channel = new MessageChannel();
    this.state = {};
    this.listeners = {};

    this.preInit();
    this.initIframe();
    this.initAppManager();
  }

  preInit() {
    window.parent.postMessage({ type: 'readyToConnect' }, '*');
  }

  initIframe() {
    if (this.iframe) {
      this.iframe.addEventListener('load', () => {
        this.iframe?.contentWindow?.postMessage({ type: 'connect' }, '*', [
          this.channel.port2,
        ]);

        this.channel.port1.onmessage = (event) => {
          const { type, payload } = event.data;
          if (payload) this.sendMessageToIframe(type, payload);
        };
      });
    }
  }

  initAppManager() {
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

  sendMessageToIframe(type: string, payload: string | undefined) {
    try {
      this.channel.port1.postMessage({
        type,
        payload: JSON.stringify(payload),
      });

      console.log('sendMessageToIframe', type, payload);
    } catch (error) {
      console.error('Error sending message to iframe:', error);
    }
  }

  on(event: string, callback: (payload: string) => void) {
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
